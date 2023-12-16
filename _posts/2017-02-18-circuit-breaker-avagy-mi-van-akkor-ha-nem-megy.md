---
id: 1530
title: 'Circuit breaker, avagy mi van akkor, ha nem megy?'
date: '2017-02-18T21:47:39+01:00'
author: tacsiazuma
layout: post
guid: '{{ site.url }}/admin/?p=1530'
permalink: /2017/02/18/circuit-breaker-avagy-mi-van-akkor-ha-nem-megy/
tie_post_bg:
    - ''
    - ''
tie_post_color:
    - ''
    - ''
tie_gallery_style:
    - slider
    - slider
tie_link_url:
    - ''
    - ''
tie_link_desc:
    - ''
    - ''
tie_video_url:
    - ''
    - ''
tie_embed_code:
    - ''
    - ''
tie_audio_mp3:
    - ''
    - ''
tie_audio_m4a:
    - ''
    - ''
tie_audio_oga:
    - ''
    - ''
tie_audio_soundcloud:
    - ''
    - ''
tie_quote_author:
    - ''
    - ''
tie_quote_link:
    - ''
    - ''
tie_quote_text:
    - ''
    - ''
tie_status_facebook:
    - ''
    - ''
tie_status_twitter:
    - ''
    - ''
dsq_needs_sync:
    - '1'
    - '1'
newsphere-meta-content-alignment:
    - align-content-left
image: 'assets/uploads/2017/02/09220006/twitter-fail.jpg'
categories:
    - Architecture
    - Backend
    - PHP
tags:
    - breaker
    - circuit
    - laravel
    - pattern
    - php
---

Amikor szoftvert írunk, akkor törekszünk arra, hogy bolondbiztos legyen. Amikor webre fejlesztünk sem történik ez másként. Minden tőlünk telhetőt megteszünk annak érdekében, hogy bizony a felhasználó mindig megkapja, amit akar, hiszen nekünk közvetve belőlük van pénzünk. Azonban akadnak olyan esetek, mikor külső tényezők is befolyásolhatják a szolgáltatást, amit nyújtunk? Akkor bizony tudni kell esni. Ahogy manapság egyre nő a microservice hype, egyre gyakrabban fogunk találkozni azzal, hogy bizony, ki kell hívni egy külső service felé, ami nem mindig végződik egy boldog 200-as válasszal. Cikkünkben a Circuit breaker patternről lesz szó és arról, hogy is segíthet ez nekünk, ha külső szolgáltatásokra épül az oldalunk.  
[![](assets/uploads/2017/02/IMO_10kA_Miniature_Circuit_Breakers.jpg)](assets/uploads/2017/02/IMO_10kA_Miniature_Circuit_Breakers.jpg)

A szoftverfejlesztésben igen gyakori, hogy valami külső szolgáltatást használunk, nem kell feltétlenül REST/SOAP hívásra gondolni, hiszen aki már használt valamilyen SMTP alapú mailert is egy külső szolgáltatást használt. Ezek a remote hívások az esetek döntő többségében gyorsak és megbízhatóak, de sajnos ez nem mindig van így.

A circuit breaker alapötlete pofonegyszerű. Az előző [cikkünkben]({{ site.url }}/2017/01/23/soap-avagy-run-you-fools/) használtuk a webserviceX egyik SOAP service-ét. Tegyük fel, hogy egy webáruházat készítünk, ahol a checkout page kirenderelésekor egy hasonló megoldással megyünk egy külső service felé, ami jelen esetben egy InventoryService lesz. Innen le tudjuk kérdezni azt, hogy valóban hány termék van raktáron, mert az eddig cache-elt érték a nagy forgalom miatt időközben változhatott. De tegyük fel, hogy ez a hívás egy szolid 30 sec-es timeoutra fut. A felhasználónk csak vár és vár, aztán az oldal elszáll egy hibával. Na és akkor képzeljük el, hogy 1000 user várja a kis 30 másodpercet. 1000 nyitott kapcsolat a PaymentService felé. Szerencsétlen így is döglődik, mi meg tovább rugdossuk. A support próbálja újraéleszteni, de mikor újraindítják, rögtön lehal, mert mi DoS-oljuk azt. Sok mindennek lehet nevezni, csak nem egészségesnek.[![](assets/uploads/2017/02/twitter-fail.jpg)](assets/uploads/2017/02/twitter-fail.jpg)

Akkor hogy jön ide a circuit breaker? Fogjuk ezt az InventoryService-t és elwrappeljük azt egy ilyen Circuit Breaker Proxyval. Ez annyit fog csinálni, hogy lesi a hibákat és amikor elér egy szintet, akkor átvált, zárt állapotról nyitott állapotra. Ilyen állapotban pedig rögtön visszadob egy hibát, nem fogja megint megpróbálni a hívást. Na de nézzük meg, hogy is működik ez az egész!

Az első lépés egy composer csomag lesz, mégpedig a

```
composer require letscodehu/php-circuit-breaker
```

Ha ezzel megvolnánk, akkor első körben szükségünk lesz valami olyan service-re, amit tudunk piszkálgatni. Ehhez létrehozunk egy FakeService osztályt, ami a guzzlehttp segítségével kihív lokálban egy olyan endpointra, amit tudunk majd befolyásolni, hogy szimuláljuk a kimaradásokat.

```
use GuzzleHttp\Client;

class FakeService {

    private $client;

    function __construct(Client $client)
    {
        $this->client = $client;
    }

    public function slowCall() {
        return $this->client->get("http://cb.localhost.hu/slow")->getBody();
    }

}
```

Na most akkor hozzuk létre azt az endpointot, amit itt meglövünk. Én a példákban ezt egy Laravel 5.3-ban végzem:

```
Route::get("/slow", function() {
    // itt jól működik, gyors is
    return "100";
});
```

```
Route::get("/slow", function() {
    sleep(2); // a lassulást ezzel fogjuk szimulálni
    abort(500); // valamint 500-as hibát is dobunk
});
```

A második verziót egyelőre kommenteljük ki, most a jó működésre vagyunk kiváncsiak.

Az alapeset ugye annyi, hogy simán meghívjuk az egészet, circuit breaker nélkül:

```
Route::get("/home", function() {

    $fakeService = new \App\Services\FakeService(new \GuzzleHttp\Client());
    $content = $fakeService->slowCall();
    return $content. "-asért a kilója az almának!";

});
```

Ez tök jó, egészen addig, amíg tökéletesen működik a másik oldal. Na most írjuk át az endpointokat és az eddig kikommentezett `/slow` üzemeljen most. Hát igen, elkezd lassulni az egész, dobálja a hibákat. Persze bekerülhet az egész egy try-catch blokkba, de minden alkalommal meg fogja próbálni, tehát a try minden alkalomal 2 másodpercig várakoztatja a felhasználót, holott az X. alkalommal már lehet sejteni, hogy bizony valami nem kóser. Itt kellene elővenni a `siege` nevű linux programot, amivel meg tudjuk nézni, hogy mennyi felhasználót tudunk így kiszolgálni. Először is telepítsük azt:

```
sudo apt-get install siege
```

Utána a használata már nem bonyolult:

```
siege http://cb.localhost.hu/home --time=1M
```

Ezzel egy percen át 15 konkurens felhasználót szimulálunk, akik folyamatosan ostromolják az oldalunkat. Az eredmény pedig hasonló lesz:

```
** SIEGE 3.0.8
** Preparing 15 concurrent users for battle.
The server is now under siege...
Lifting the server siege... done.

Transactions: 340 hits
Availability: 100.00 %
Elapsed time: 59.65 secs
Data transferred: 0.01 MB
Response time: 2.05 secs
Transaction rate: 5.70 trans/sec
Throughput: 0.00 MB/sec
Concurrency: 11.68
Successful transactions: 340
Failed transactions: 0
Longest transaction: 3.05
Shortest transaction: 2.01
```

A lényeg a response time és a shortest-longest transaction, ami a leggyorsabb és leglassabb választ takarja. Láthatjuk, hogy mindenhol kivárta a két másodpercet, amíg a túloldal elfailelt. Akkor most vessük be azt a bizonyos circuit breakert! A library cache-t használ, de írhatunk saját adaptert is, ha az APC/memcached/Redis közül egyik sem nyerő. Mi a példában a Redist fogjuk használni, amihez szükségünk lesz a `predis/predis` library-re:

```
composer require predis/predis
```

Első körben hozzuk létre magát a CircuitBreakert:

```
$circuitBreakerFactory = new \Ejsmont\CircuitBreaker\Factory();
$redisClient = new \Predis\Client(); // szükségünk lesz egy Redis kliensre is
$circuitBreaker = $circuitBreakerFactory->getRedisInstance($redisClient, 5, 20);
```

A fenti kódban létrehozunk egy factory-t, amivel tudjuk majd példányosítani a CircuitBreakerünket. A factory metódusban átadjuk a `Redis` klienst, valamint megmondjuk neki, hogy az 5. hibás hívás után tekintse a szolgáltatást offline-nak és 20 másodperc után próbálkozzon újrahívni azt, hátha életre kelt.

```
$fakeService = new \App\Services\FakeService(new \GuzzleHttp\Client());
if ($circuitBreaker->isAvailable("FakeService")) {
    try {
        $content = $fakeService->slowCall();
        $circuitBreaker->reportSuccess("FakeService");
    } catch (\GuzzleHttp\Exception\ServerException $e) {
        $content = 0;
        $circuitBreaker->reportFailure("FakeService");
    }
    return $content. "-asért a kilója az almának!";
} else {
    return "A FakeService sajnos most nem elérhető, kérjük jöjjön vissza később!";
}
```

Itt ugye létrehozzuk a service-t, aztán első körben ellenőrízzük, hogy offline-e, ha nem, akkor megpróbálkozunk ráhívni, ha sikerül, akkor jelentjük, hogy a szolgáltatás újra él. Ellenben ha hibára futunk, akkor azt is jelentsük.

Ha azt látjuk, hogy a szolgáltatás nem működik, akkor valami alternatív dolgot meg tudunk jeleníteni a frontenden. Persze ha az oldalunk működése szempontjából kritikus a szolgáltatás megléte, akkor nem vagyunk sokkal előrébb.

Mi is ez az egész circuit breaker? Ha az áramköröknél használt biztosítékra gondolunk, akkor itt is hasonló a működés, ún. nyitott és zárt állapot. Zárt állapotban van összezárva az áramkör, tehát keresztülfolyik rajta az áram. Nyitott állapotban viszont nem. Alapból zárt állapotban indul az egész. Hívjuk a szolgáltatást és amíg sikerül, addig nem történik semmi. Viszont elkezd kimaradozni és jelentjük hogy hibádzik. Ha elérjük a megadott limitet, akkor az áramkör nyit. Itt már nem megyünk ki a szolgáltatás felé, egészen addig, amíg le nem telik a megadott reset timeout. Ez egy harmadik, ún. félig nyitott állapot. Ekkor megint rendesen kimegyünk a szolgáltatás felé, mintha zárt állapotban lenne az áramkör, de ha hibára futunk, akkor nem várjuk meg az X hibát, hanem rögtön nyitjuk az áramkört és megint csak a reset timeout lejárta után próbálkozunk újra.[![](assets/uploads/2017/02/state.png)](assets/uploads/2017/02/state.png)

Próbálgassuk most kézzel és látni fogjuk, hogy igen hamar az alternatív szöveget fogjuk látni. A `siege`-re pedig így reagál:

```
Transactions: 1670 hits
Availability: 100.00 %
Elapsed time: 59.67 secs
Data transferred: 0.15 MB
Response time: 0.04 secs
Transaction rate: 27.99 trans/sec
Throughput: 0.00 MB/sec
Concurrency: 1.20
Successful transactions: 1670
Failed transactions: 0
Longest transaction: 4.07
Shortest transaction: 0.00
```

Láthatjuk, hogy az átlag válaszidő 0.04 másodperc volt, tehát döntő többségében ki se mentünk a service felé. Most próbáljuk újra a `siege`-el a dolgot, de menet közben kapcsoljuk vissza a jól működő route-ot, ami nem várakoztat és nem fut hibára.

```
Transactions: 1754 hits
Availability: 100.00 %
Elapsed time: 59.75 secs
Data transferred: 0.10 MB
Response time: 0.02 secs
Transaction rate: 29.36 trans/sec
Throughput: 0.00 MB/sec
Concurrency: 0.67
Successful transactions: 1754
Failed transactions: 0
Longest transaction: 2.02
Shortest transaction: 0.00
```

Látható, hogy közel ugyanolyan eredményt értünk el.

De most jöjjön a feketemágia része!

Ha már Laravelben megy ez az egész, akkor miért ne csinálhatnánk mindezt a lehető legegyszerűbben? Hogy tudnánk ezt az egészet elrejteni, netán automatizálni?

Első körben vegyük fel az `AppServiceProvider`ünkben a `CircuitBreaker`-t:

```
$this->app->singleton(CircuitBreaker::class, function() {
    $factory = new Factory();
    $client = new Client();
    return $factory->getRedisInstance($client, 5, 20);
});
```

Ez még nem ördöngősség. Viszont a használt library tud még egy olyan gonosz dolgot, hogy dinamikus proxy-t épít egy osztály köré és annak metódusait elburkolja a fent is látott if és try-catch blokkal.

A mágiát egy ún. `CircuitBreakerProxyFactory` osztály végzi, annak is a `create` metódusa:

```
$this->app->bind(FakeService::class, function() {
    return CircuitBreakerProxyFactory::create(FakeService::class, $this->app->make(CircuitBreaker::class), [new \GuzzleHttp\Client()]);
});
```

A lényeg, hogy a kreált [proxy]({{ site.url }}/admin/2015/02/19/a-proxy-pattern-szerepe-az-okori-romaban/) ugyanabból az osztályból származik, mint az amit elburkol, ennélfogva ahol az előbbit tudtuk használni, ott a proxyt is tudjuk majd.[![](assets/uploads/2017/02/05a.jpg)](assets/uploads/2017/02/05a.jpg)

A create 3+1 opcionális paramétert vár. Az első az a service neve, ahol én praktikusan az osztály nevét használom. Ezt azért kell elkülöníteni, mert ez alapján válogatja szét a Circuit Breaker a cache-ben a kulcsokat. A második paraméter az maga a `CircuitBreaker`, amit használni fog a háttérben. A harmadik paraméter egy tömb, amiben az osztály példányosításához szükséges paramétereket adjuk át, abban a sorrendben, ahogy a konstruktorban is vannak. A negyedik opcionális paraméterről majd némileg később ejtenék szót. A proxy létrehozása viszonylag erőforrás igényes feladat, körülbelül 0.00007 másodpercet vesz igénybe, de általában egy rendszer nem használ többet 2-3 ilyennél. A proxy osztályt cache-eljük, ha változtatunk az osztályon, csak akkor kell újragenerálni azt. Na de most bebindoltuk az osztályt, ennélfogva próbáljuk is ki!

```
Route::get("/home", function(\App\Services\FakeService $fakeService) {
    $content = $fakeService->slowCall();
    if ($content == null) {
        return "A FakeService sajnos most nem elérhető, kérjük jöjjön vissza később!";
    } else {
        return $content. "-asért a kilója az almának!";
    }
});
```

Egyetlen if-el megúsztuk az egészet, mivel ha nem sikerül a hívás, akkor a visszatérési érték üres marad, ez alapján tudjuk eldönteni, hogy működik-e a szolgáltatás vagy sem.

> **Fontos:** egyetlen CircuitBreaker több szolgáltatáshoz/proxyhoz is felhasználható, amíg a kulcsok mentén elkülönítjük őket.

Na de nézzük csak mi történik itt a mélyben!

[![](assets/uploads/2017/02/aid220347-728px-Do-the-Black-Magic-Step-5-Version-2.jpg)](assets/uploads/2017/02/aid220347-728px-Do-the-Black-Magic-Step-5-Version-2.jpg)

Van egy ún. `ProxyMethodHook` osztályunk, ami végzi a piszkos munkát. Amikor ilyen proxy-t gyártunk, akkor ezeken át érjük el az elburkolt osztályt. Amikor bejön egy hívás, először is ellenőrízzük, hogy tartozik-e hozzá ilyen:

```
/**
 * Does this hook support this method
 *
 * @param ReflectionMethod $method
 * @return boolean
 */
public function supports(ReflectionMethod $method)
{
    // ignores the magic functions
    return !in_array($method->getName(), array("__construct", "__destruct","__isset", "__invoke","__clone","__debugInfo", "__unset", "__sleep","__toString", "__wakeup" , "__call", "__get", "__set", "__callStatic"));
}
```

A magic metódusok és a constructor kivételével bármire rá van húzva mindez alapesetben. Ha a supports true-val tér vissza, akkor az adott metódus esetében ennek az osztálynak az invoke metódusa lefut:

```
/**
 * Called instead of the original method
 *
 * @param mixed $proxy the proxy object
 * @param ReflectionMethod $method original method
 * @param array $args original methods arguments
 */
public function invoke($proxy, ReflectionMethod $method, array $args)
{
    $returnValue = null;
    $oldTimeout = ini_get("default_socket_timeout");

    if ($this->circuitBreaker->isAvailable($this->serviceName)) {
        try {
            ini_set("default_socket_timeout", $this->timeout);
            $returnValue = $method->invokeArgs($proxy, $args);
            $this->circuitBreaker->reportSuccess($this->serviceName);
        } catch(\Exception $e) {
            $this->circuitBreaker->reportFailure($this->serviceName);
        }

    }
    ini_set("default_socket_timeout", $oldTimeout);

    return $returnValue;
}
```

Na itt van az igazi feketemágia. Először is beállítjuk a returnValue-t nullra, utána a socket\_timeout-ot kinyerjük, hogy később vissza tudjuk állítani. Mivel remote hívásokkal dolgozunk, ezért lehet ezt is alacsonyan akarjuk tartani. Ezután ugyanúgy ellenőrízzük, hogy az adott service elérhető-e. Beállítjuk az alacsony timeoutot, meghívjuk a metódust, ami a proxy mögé van bújtatva és ha nem volt hiba, akkor jelentsük vagy ha volt, akkor azt is. Ezután visszaállítjuk az eredeti timeoutot és visszatérünk a visszatérési értékkel. Ami itt fontos lehet és amiért érdemes lehet saját `MethodHook` implementációkat létrehozni az az, hogy itt nem tudjuk, hogy mi is történik az elburkolt osztályban, ennélfogva minden Exceptiont a külső service hibájának hiszünk, pedig lehet, hogy nálunk van a baj. Valamint érdemes lehet logolást is elhelyezni itt, hogy lássuk, ha a külső szolgáltatások nem mentek.

Persze ilyenkor jönnek azok a vélemények, miszerint a Reflectiont egyenesen az ördög teremtette, mert nagyon erőforrásigényes, stb. Ez teljesen valid, ellenben inkább tartson tovább egy request 0.0001 másodperccel, mint tök feleslegesen pingeljek egy 3rd party service-t 🙂