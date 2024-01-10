---
id: 1037
title: 'Refactoring a javából'
date: '2016-03-24T23:59:40+01:00'
author: tacsiazuma
layout: post
guid: '{{ site.url }}/?p=1037'
permalink: /2016/03/24/refactoring-a-javabol/
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
dsq_thread_id:
    - '4690907800'
    - '4690907800'
newsphere-meta-content-alignment:
    - align-content-left
image: 'assets/uploads/2016/03/09202045/Hat-Design.jpg'
categories:
    - PHP
tags:
    - 'bad design'
    - codebase
    - eruption
    - hack
    - 'long method'
    - php
    - refactoring
---

Elképesztő módon elmaradtam az írásokkal, amire semmilyen (még az ivás se) lehet mentségemre. Ezért most ha tudom, akkor megpróbálom pótolni, de már inkább nem is ígérek semmit, mert eddig nem úgy tűnt, hogy be tudom tartani 🙂

A kódminőség a fejlesztők életében elég kritikus téma. Ha szóba kerül a refaktorálás szó, akkor mindenki valami szörnyű, 10 éves kódbázisra asszociál, aminél ha bekapcsoljuk a deprecated hibák kiírását, százával kezdi kihányni két kiíratás közben, hogy bizony az mysql\_connect már öregebb, mint az iOS7.. így le kéne cserélni.

A refaktorálás mikéntjéről, példákról és magáról a folyamat szellemiségéről lesz szó az alábbi cikkünkben:

<figure aria-describedby="caption-attachment-1038" class="wp-caption aligncenter" id="attachment_1038" style="width: 444px">[![Hat-Design](assets/uploads/2016/03/Hat-Design.jpg)](assets/uploads/2016/03/Hat-Design.jpg)<figcaption class="wp-caption-text" id="caption-attachment-1038">Design hat, a gányer-kipa ellentéte</figcaption></figure>

**Miért is refaktorálunk?**

Ha bárki huzamosabb ideig kódolt az életében és néha-néha visszatért korábbi munkásságához, akkor jó eséllyel, amikor arra rápillantott, felmerült benne a kérdés:

> Ki volt aki így összegányolta ezt<del> a kib\*szott biztosítószekrényt</del>?

[![TnQRX6v](assets/uploads/2016/03/TnQRX6v.gif)](assets/uploads/2016/03/TnQRX6v.gif)

Nos az emberek, így bizony a kóderek is, fejlődnek. Ennek több vonzata van, de jó eséllyel a programozási szokásaink is egyre jobbak és letisztultabbak lesznek, így ha visszanézünk egy kódunkra amit pl. 3 hónapja írtunk és nem merül fel bennünk az, hogy újraírnánk, vagy legalább egy-két dolgon módosítanánk, az két dolgot jelenthet:

- Elértük a Zen állapotot és mi szerkesztjük a [bliki](http://martinfowler.com/bliki/)-t.
- Baj van, mert nem fejlődtünk azóta gondolkodásmódban.

Persze előferdülhet a középút is, de általában ritka. Amikor kódolunk, akkor a cél, hogy új funkciót adjunk hozzá a rendszerhez. Amikor refaktorálunk, akkor pont ennek az ellenkezőjét tesszük, megpróbáljuk szépíteni a kódot, úgy hogy a funkció tökéletesen ugyanaz maradjon. Ez utóbbit úgy tudjuk a legkönnyebben ellenőrízni, ha <del>filewatcherre rakjuk az F5-öt</del> az adott kódrészt tesztekkel fedjük le. Akár a tesztek utólagos írása, akár maga a refaktorálás időt igényel, ami idő bizony pénzbe kerül, amit a legtöbb esetben nem szívesen fizetnének ki. Mégis mivel tudjuk indokolni azt a <del>mélyen tisztelt</del> megrendelőnek, hogy bizony most X órán át nem fogok új funkciót hozzáadni, hanem széppé teszem a kódot, hogy bátran feltoljam githubra, tehát a gazdasági értéke ugyanannyi marad...

 **de kiszámlázzuk.**

Na most aki tud olyan megrendelőt - akinek nincs valamiféle szép kód fétise -, aki ebbe belemegy.. szóval ez hülyeség, ilyennel nem lehet megrendelőt meggyőzni. Kell más oka is legyen.

Hát persze, hogy van! Azzal, hogy a kódbázist folyamatosan, vagy időszakosan kitisztítjuk, a saját későbbi munkánkat egyszerűsítjük le, gyorsítjuk meg, tehát hosszútávon ez kevesebb munkaórában fog megmutatkozni. Kevesebb munkaóra = kevesebb költség. Ezzel már inkább meg lehet győzni egy pénzügyi embert.

Viszont itt jön a következő kérdés náluk:

> Miért kell a kódot tisztítani? Miért nem írod meg alapból szépre? Azért vagy jó fejlesztő, mert meg tudod elsőre is szépen írni, nem?

Hát nem (persze mindig akadnak roppant különleges emberek, főleg az olvasók közt, akik képesek rá, tudom 🙂 ).

A probléma köré, amit boncolgatni fogunk egy egész fejlesztési metodológia épült.

**TDD (Test driven development)**

Sokaknak lesz ismerős a fenti fogalom, de azért újra elismételném az alapjait. A dolog lényege annyi, hogy először írsz egy tesztet, hogy mit is szeretnél az adott kódrészlettől. Ekkor a tesztjeid csecsre futnak, mert még nincs is kész a class, function, stb. Utána implementálod az adott funkciót. Ezt ideális esetben minél gyorsabban, anélkül, hogy szépítgetnénk a kódot. <span style="line-height: 1.5;">Lefuttatod a tesztet, átment.</span>

Ezután pedig jön az, hogy refaktorálod az adott kódrészletet, hogy még szép is legyen. Ezután újabb teszteket írsz, az új funkciókra, lefuttatod és így tovább.

Miért van különvéve a funkció implementálása és a refaktorálás? Miért nem lehet egyben?

Nos az oka az, amit az imén említettem. Amikor egy új funkciót implementálunk, akkor az agyunk ebben az üzemmódban van, hogy azt az új funkciót hozzáadja, minél egyszerűbben.

A járőröző vezető fejlesztő szokott néha odaszólni a kollégáknak, hogy:

> Dehát ez spagettikód!

**Na, pont ezt eredményezi.** Először minél hamarabb implementálni akarjuk a funkciót. Itt van rajtunk az ún. gányerkipa. Aztán jó esetben, ha megvagyunk vele, akkor nem hagyjuk úgy, hanem szebbé varázsoljuk azt (design hat).

Persze refaktorálni nem csak ilyenkor lehet, gondoljunk csak a legelső példára. Bóklászunk a kódbázisban és egyszer csak elkezd legyezgetni a frontendes kolléganőnk, mert úgy elfehéredtünk, hogy fél, menten elájulunk. Aztán megisszuk a kötelező cukros kávét, helyreáll a keringésünk és megpróbáljuk megfejteni, hogy ez az osztály/metódus, amit használnunk kellene, vajon mit is csinál? Aztán rájövünk, megírjuk az őt használó kódrészletet és továbbállunk...

**Na ezt nem szabadna.** Amikor végre megértettük, hogy egy kódrészlet mit csinál, de ez időt vett igénybe, akkor bizony azon valamennyit szépíteni kell. Ha nem is teljesen tesszük rendben, ne hagyjuk az ilyeneket úgy, mert legközelebb ugyanennyi időt fog igénybe venni.

Általánosan elfogadott, hogy minél többet használunk egy kódrészletet, annál szebbnek kell annak lennie. Ha valami kód gányul fest, de mi azt a fejlesztés során nem érintjük, akkor azt nem fontos rendbe tenni, lévén nem fogja vissza a munkánkat.

Van egy úgynevezett cserkész szabály, miszerint:

> Akármerre is jársz, a környezeted csak jobb állapotban hagyd ott, mint ahogy azt kaptad.

Ha ezt a kódolás folyamatára megpróbáljuk ráhúzni, akkor annyit jelent, hogyha egy kódrészlethez érsz, akkor azon mindig egy picit szépíts. Nem sokat, tényleg csak pár percet szánj rá és ne akard megváltani a világot, de ha ezt a szabályt betartod, akkor a kódminőség nem fog szép lassan a nulla felé tendálni, hanem tart egy stabil szintet, vagy még talán jobb is lesz.

Miket kell ilyenkor javítani? Ha látsz egy kódrészletet, amit nem értesz meg fél perc alatt, akkor azon kell csiszolni, mert legközelebb is kell az a fél perc. Ha valami első pillantásra is tarkónlövi a szépérzéked, akkor azt szintén.

Ezzel pedig elérkeztünk a cikkünk lényegi részéhez. Vegyünk sorra hát egy pár példát (ha van igény, akkor lehet folytatása is), ami javítandó és a javítás módját!

**Hosszú metódusok[![long-dog-web](assets/uploads/2016/03/long-dog-web.jpg)](assets/uploads/2016/03/long-dog-web.jpg)**

Egy egyszerű, kezdetben szép metódus egyre jobban elkezd hízni, mert innen-onnan hozzácsapunk pár sort:

> Az az egy sor mit számít?

Mikor legközelebb rápillantunk, akkor a metódusunk valahogy így néz ki:

```
public function authGoogle(Request $request) {
    $client = new \Google_Client();

    $client->setClientId(env('OAUTH2_CLIENT_ID'));
    $client->setClientSecret(env('OAUTH2_CLIENT_SECRET'));
    $client->setAccessType("offline");
    $client->setScopes('https://www.googleapis.com/auth/youtube.upload');
    $redirect = filter_var(url("api/auth-google"),
        FILTER_SANITIZE_URL);
    $client->setRedirectUri($redirect);
    if (Cache::has("token")) {
        $client->setAccessToken(Cache::get("token"));
        if (!$client->isAccessTokenExpired()) {

            return "A token még él! A kapott access-token: ".Cache::get('token')["access_token"].
            "és refresh token:" .Cache::get('refresh_token');
        } else {
            $client->fetchAccessTokenWithRefreshToken(Cache::get("refresh_token"));
            Cache::put('token', $client->getAccessToken(), 1440);
        }
    }

    if ($request->input("code")) {
        $client->authenticate($_GET['code']);
        $token = $client->getAccessToken();
        $refreshToken = $client->getRefreshToken();
        Cache::forever('token', $token);
        Cache::forever('refresh_token', $refreshToken);
        return "A token frissítve lett. A válasz: ".json_encode($token);
    }
    $authUrl = $client->createAuthUrl();
    return view("auth.google")->with("authUrl", $authUrl);
}
```

Nem valami szép, ugye? Na most erre már ránézve is el kell gondolkozni, hogy vajon mit is csinál, nemde? Ez amúgy egy webes felületet biztosít arra, hogy a háttérben jobként zajló youtube feltöltésekhez ne kézzel kelljen valahol felvenni a tokent, hanem azt valahol a cache-ben letárolja. Több sebből is vérzik, mert nem controllerben kellene mindezt, de egyelőre csak a hosszúsággal foglalkozzunk. Az első módszer, amit itt alkalmazunk az ún. extract method lesz. A $client inicializálása semmit se használ a kapott paraméterekből, szóval egy metódusból nyerjük azt ki.

```
/**
 * Returns a preconfigured google client with youtube upload scope, and '{host}/api/auth-google' redirect url already set.
 * @return \Google_Client
 */
private function getGoogleClient()
{
    $client = new \Google_Client();
    $client->setClientId(env('OAUTH2_CLIENT_ID'));
    $client->setClientSecret(env('OAUTH2_CLIENT_SECRET'));
    $client->setAccessType("offline");
    $client->setScopes('https://www.googleapis.com/auth/youtube.upload');
    $redirect = filter_var(url("api/auth-google"),
    FILTER_SANITIZE_URL);
    $client->setRedirectUri($redirect);
    return $client;
}
```

Ezután jöjjön a másik nagyobb falat. Ha az authorizációs kódot megtaláljuk a request paraméterei közt, tehát redirect volt, akkor annak segítségével kinyerjük a refreshtokent és access tokent, majd tároljuk őket cacheben. Ezután visszaadunk egy sima plaintext response-t.

```
/**
 * Authenticate and refreshes the cache with the newly aquired tokens
 * 
 * @param $client
 * @return string 
 */
private function refreshCachedTokenByAuthCode($client)
{
    $client->authenticate($_GET['code']);
    $token = $client->getAccessToken();
    $refreshToken = $client->getRefreshToken();
    Cache::forever('token', $token);
    Cache::forever('refresh_token', $refreshToken);
    return "A token frissítve lett. A válasz: " . json_encode($token);
}
```

Ezután már némileg javult a helyzet az actionüknben, bár még mindig hagy némi kívánnivalót maga után:

```
public function authGoogle(Request $request) {
    $client = $this->getGoogleClient();
    if (Cache::has("token")) {
        $client->setAccessToken(Cache::get("token"));
        if (!$client->isAccessTokenExpired()) {
            return "A token még él! A kapott access-token: ".Cache::get('token')["access_token"].
            "és refresh token:" .Cache::get('refresh_token');
        } else {
            $client->fetchAccessTokenWithRefreshToken(Cache::get("refresh_token"));
            Cache::put('token', $client->getAccessToken(), 1440);
        }
    }
    if ($request->input("code")) {
        return $this->refreshCachedTokenByAuthCode($client);
    }
    $authUrl = $client->createAuthUrl();
    return view("auth.google")->with("authUrl", $authUrl);
}
```

Na és a refaktorálás itt fog véget érni, mert a további módosításokhoz a működést kell megváltoztatni. Fel kell ismét venni a gányerkipát. Ha megfigyelitek több hiba is van a dologban. Az egyik, hogy a középen rejlő else ág habár frissíti a tokent és el is tárolja azt, mégis megjeleníti az auth felületet, pedig a frissítés után ugyanúgy ki kéne írnia azt (ami igazából csak debug purpose), mert felesleges újra belépni. Tehát ezt az egész if ágat ki kéne egyenesíteni:

```
if (Cache::has("token") && Cache::has("refresh_token")) {
    $client->setAccessToken(Cache::get("token"));
    $state = "még él";
    if ($client->isAccessTokenExpired()) {
        $client->fetchAccessTokenWithRefreshToken(Cache::get("refresh_token"));
        Cache::put('token', $client->getAccessToken(), 1440);
        $state = "frissítve";
    }
    return sprintf("A token %s! A kapott access-token: %s és refresh token: %s ",
        $state,
        Cache::get('token')["access_token"],
        Cache::get('refresh_token')
    );
}
```

Ezek után ezt az egészet ki lehet mozgatni egy másik metódusba:

```
/**
 * If both token set in the session, we check for the expiry of the access token
 * if expired, use the refresh token to refresh it. Then provide a simple response in order to inform the user.
 * @param $client
 * @return string
 */
private function mayRefreshAccessTokenByRefreshToken($client)
{
    $client->setAccessToken(Cache::get("token"));
    $state = "még él";
    if ($client->isAccessTokenExpired()) {
        $client->fetchAccessTokenWithRefreshToken(Cache::get("refresh_token"));
        Cache::put('token', $client->getAccessToken(), 1440);
        $state = "frissítve";
    }
    return sprintf("A token %s! A kapott access-token: %s és refresh token: %s ",
        $state,
        Cache::get('token')["access_token"],
        Cache::get('refresh_token')
    );
}
```

Ha ezzel is megvagyunk, akkor az eredeti metódusunk így fest:

```
/**
 * Gets google client. If both tokens are set then 
 * provides a response about them, and refresh the access token if needed
 * If no token provided, but auth code is given, fetch the token by it. 
 * If both turn out to be false then display the auth form.
 * @param Request $request
 * @return $this|string
 */
public function authGoogle(Request $request) {
    $client = $this->getGoogleClient();
    if (Cache::has("token") && Cache::has("refresh_token")) {
        return $this->mayRefreshAccessTokenByRefreshToken($client);
    }
    if ($request->input("code")) {
        return $this->refreshCachedTokenByAuthCode($client);
    }
    $authUrl = $client->createAuthUrl();
    return view("auth.google")->with("authUrl", $authUrl);
}
```

Azért némileg egyszerűbb ezek után felfogni, hogy mi is a célja, nemde? Nézzünk egy másik szépséget!

**Hosszú paraméterlista**

Amikor három, vagy annál több paraméterrel hívunk meg egy metódust, akkor ott van rá egy reális esély, hogy bizony sz\*r van a palacsintában. Ezt orvosolni kell és az alábbi egy elég jó példája lesz annak, hogy is néz ki egy ilyen. Szolid hat paraméterünk van, amiket felhasználunk egy e-mail kiküldésére. Konfigurációban van egy tömbünk, amivel kurzushoz tartozó kulcs alapján kiszedjük a hozzá tartozó nevet.. (miért konfigból? miért nem adatbázisban tároljuk az ilyesmit?). Példányosítunk egy viewmodelt, feltöltjük változókkal kikérjük a belőle nyert HTML-t, majd azzal szimplán küldünk egy e-mailt a névre és címre:

```
public function sendCourseNotification($name, $phone, $date, $email, $course, $price) {
    $courses = Config::getInstance()->get("courses");
    $course = array_keys($courses, $course)[0];
    $template = ViewModel::get()
        ->setTemplate("/email/course-app")
        ->setVariable("name", $name)
        ->setVariable("date", $date)
        ->setVariable("phone", $phone)
        ->setVariable("course", $course)
        ->setVariable("price", $price)
        ->getMarkup();
    $this->getMailer()->addAddress($email, $name);
    $this->getMailer()->Subject = "Tanfolyamra jelentkezés";
    $this->getMailer()->msgHTML($template);
    $this->getMailer()->send();
}
```

Na most így elsőre csúnya a dolog, mert a viewmodelbe töltjük fel változók nagy részét. Csak és kizárólag oda. Akkor ennyi erővel az osztályunkat is átadhatnánk paraméterként, nem? Netán ha ezeket a paramétereket egy másik objektum getterei által nyerjük ki, akkor készíthetnénk egy ún. hydratort, ami a változók alapján feltölti a viewmodelt az e-mail küldéshez.

De nézzük először a legegyszerűbbet, ha magát a ViewModelt adjuk át. Ezen, hogy némi logikát is hagyjunk már ebben a metódusban, hiszen ez lenne a dolga, beállítjuk a template-et, majd kikérjük a generált markupot és ezzel küldjük el az e-mailt:

```
/**
 * Sends a course application notification to the given user/email pre-filled
 * with the variables in the viewmodel using the course/app template.
 * @param string $name
 * @param string $email
 * @param ViewModel $viewModel
 * @throws \phpmailerException
 */
public function sendCourseNotification($name, $email, ViewModel $viewModel) {
    $this->getMailer()->addAddress($email, $name);
    $template = $viewModel->setTemplate("/email/course-app")
        ->getMarkup();
    $this->getMailer()->Subject = "Tanfolyamra jelentkezés";
    $this->getMailer()->msgHTML($template);
    $this->getMailer()->send();
}
```

Ez egy jóval egyszerűbb példa, de mint mindent, ezt is többféleképpen meg lehet oldani, attól függően, hogy a rendszer hogy is néz ki. Első körben ennyit szerettem volna, ha van még igény, akkor bármikor szívesen felöltöm a [gányerkipát ](https://kuruc.info/galeriaN/hir/haszid_zsido.jpg)és hozok a fentiekhez hasonló szépségeket!
