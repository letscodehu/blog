---
id: 326
title: 'Long polling, SSE, Websocket, MMX és más szép szakszavak'
date: '2015-02-28T17:12:50+01:00'
author: tacsiazuma
layout: post
guid: '{{ site.url }}/?p=326'
permalink: /2015/02/28/long-polling-sse-websocket-mmx-es-mas-szep-szakszavak/
dsq_thread_id:
    - '3556124483'
    - '3556124483'
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
categories:
    - JavaScript
    - PHP
tags:
    - ajax
    - communication
    - javascript
    - 'long polling'
    - rpc
    - sse
    - websocket
---

A betyárnagy érdeklődésre hallgatok és a mostani témánk az lesz, hogy mi is az a polling, long polling ![Poll_votebox-1024x768](assets/uploads/2015/02/Poll_votebox-1024x768-1024x768.jpg)és cikkemben kitérek a kliens->szerver kommunikáció egyéb módjaira és azok megvalósítására.

Persze ahhoz, hogy mindezt megértsük, szokásomhoz híven nem ugrunk a mélyvízbe, hanem megvizsgáljuk az alapjait a dolognak.

#### Azok a 90-es évek

Nézzük meg, hogy a böngészőnk pontosan hogy is kommunikál a szerverrel. A HTTP protokollnak megfelelően minden lekérésnek van fejléce és opcionálisan törzse is. A válasz hasonlóan épül fel, fejléc kötelező, törzs opcionális. A válasz törzsében található a számunkra lényeges információ, amit feldolgozunk, a fejléc pedig ennek feldolgozásáról szolgáltathat adatokat. A kommunikáció roppant egyszerű, küldünk egy lekérést a 80-as (vagy 443-as) porton az adott címre, ezt a webszerver feldolgozza és azonnal (ez fontos pont) visszaküld egy választ. A kommunikáció eddig tartott. Ez az alapeset. Egy lekérés, egy válasz, ez a reguláris HTTP. Nyomunk egy jól szituált F5-öt, új lekérés, új válasz. Ha időközben újult a tartalom, akkor itt megtekinthetjük.

Ellenben mi van akkor, ha nem akarunk F5-öt nyomogatni, ahhoz, hogy a weboldalunk tartalma frissüljön? Mivel már nem a 90-es éveket írjuk, ezért erre több módszert kidolgoztak már, ezeket szeretném ismertetni.

**Ajax polling**

Tegyük fel, hogy szeretnénk egy chat-alkalmazást elhelyezni az oldalunkon, ami a böngészőben dinamikusan frissül. Az egyik legegyszerűbben megoldható megoldás az, ha mindezt Ajax-al lekéréssel tesszük meg. Az Ajax (Asynchronous JavaScript and XML) egy aszinkron lekérést fog intézni a szerverünk felé. Ez pontosan ugyanolyan, mint egy sima HTTP lekérés lenne, azzal a különbséggel, hogy ez úgymond a háttérben zajlik, erről mi nem veszünk tudomást.

<figure aria-describedby="caption-attachment-343" class="wp-caption alignright" id="attachment_343" style="width: 640px">[![ajaxpoll](assets/uploads/2015/02/ajaxpoll-1024x577.png)](assets/uploads/2015/02/ajaxpoll.png)<figcaption class="wp-caption-text" id="caption-attachment-343">Forrás: Stackoverflow</figcaption></figure>

Akkor tegyük meg a következőt:  
Az oldalunkon, ahol ezt a chat klienst elérjük, helyezzünk el script tag-ek közé egy csrf\_token változót JSON-be kódolva, valamint a $\_SESSION-ben is.  
indítsunk X időközönként egy lekérést a szerver felé, pl. a domainnev.hu/api/chat URL-re, a POST field-ben pedig küldjük el az említett tokent. Ugye a routerünket beállítjük ügyesen és okosan, hogy ez pl. az ApiController::chatAction() metódusára mutasson. Ebben a metódusban összehalásszuk az üzeneteket és visszaküldjük azt JSON-ben kódolva. Fontos: Ez a metódus NEM reguláris lekérdezés, ennélfogva nem frissíti a csrf\_tokent a $\_SESSION-ben, különben az összes többi kérés invalid lesz, viszont ez a metódus lesz az, ami megnézi, hogy a kapott token és a $\_SESSION-ben levő token egyezik-e. Ezzel megakadályozva, hogy kívülről betyárkodjanak.

Na most, mivel ez egy szimpla lekérés, erre jön egy szimpla válasz is. A header-t PHP-ben ennek megfelelően kell beállítani, application/json-re. A visszaért adatot feldolgozzuk és újabb lekérést indítunk. Így x másodpercenként lecsekkoltuk, hogy van-e új üzenet, valamint ha írtunk újat, azt is elküldhetjük a POST fieldben, amit aztán értelmezhetünk és hozzáadhatjuk az adatbázishoz.

Mi is itt a gond? A gond az, hogy X másodpercenként küldjük a lekéréseket és akár közepes látogatottságú oldalakra ez akkora felesleges terhelés lesz, ami aztán csúnyán megröccentheti a szerverünket. Gondoljunk csak bele, mi a helyzet akkor, ha nincsenek is új üzenetek, sőt, mi sem írtunk? A lekérések csak mennek és még ha nem is szolgáltatunk vissza adatot, a webszervert és a PHP-t egyaránt terheljük vele.

**Ajax Long Polling**

Akkor most nézzük meg, hogyan is tudjuk lecsökkenteni a lekérések/válaszok számát az imént említett chat kliensünknél. A változás a sima ajax-os lekéréssel szemben annyi, hogy amikor elküldjük a kérést a szerver felé, az NEM AZONNAL fog válaszolni. Tehát megkapja a kérést a szerver, értelmezi a PHP és látja, hogy bizony mi kíváncsiak vagyunk az olvasatlan üzeneteinkre. Elküldhetünk esetleg lastSyncDate-et is, ami alapján szűrhet a rendszer, stb. de a lényeg, hogyha nincs új üzenet, akkor a program nem küld vissza egy üres választ, hanem vár, majd újra próbálkozik a kereséssel, majd megint vár, majd megint újrapróbálkozik.

<figure aria-describedby="caption-attachment-344" class="wp-caption alignright" id="attachment_344" style="width: 640px">[![ajaxlongpoll](assets/uploads/2015/02/ajaxlongpoll-1024x577.png)](assets/uploads/2015/02/ajaxlongpoll.png)<figcaption class="wp-caption-text" id="caption-attachment-344">Forrás: Stackoverflow</figcaption></figure>

Ha nem akarjuk mindig felpattintani az SQL-t vagy akármilyen db-t használunk, akár memóriában letárolhatjuk az adott userekhez tartozó utolsó userID-t és amikor SQL-ben új üzenet adunk hozzá, azt beírhatjuk memcache-ben, így mielőtt az SQL-ben túrkálna a chat kliens által meghívott script, előtte ránéz, hogy egyáltalán érkezett-e új üzenet, ha igen, akkor kinyalja őket a DB-ből és visszaküldi a választ, ha nem, akkor egy loop-ban csücsül, némi sleep-el, hogy ne egye meg a processzorunkat és X időközönként kérdezi le, ha van válasz, megy a kimenet, lezárul a kapcsolat.

> Tehát a kliens lekérései most már a szerveren futnak X másodpercenként.

A kliens megkapja a választ, feldolgozza azt és egy újabb lekérést intéz a szerver felé (Pl a JQuery féle $.ajax() complete fieldjében elhelyezve, így mindig megvárja, hogy az előző kapcsolat lezáruljon, és csak utána indít egy újat). Persze itt most nem térek ki arra, hogy a kliens/szerver hogy szinkronizálja össze az üzeneteket, és hasonlókra, a lényeg, hogy a kapcsolat hosszú időn át nyitva marad, mert válasz nem érkezik.

```
<pre data-language="javascript">function requestStuffFromDaServer() {
$.ajax({
        type: "POST",
        url: host.url,
        data: {
             csrf_token : csrf_token, // itt csak a tokent küldjük be, üzeneteket még nem szinkronizálunk
        },
        complete: function(response) {
            // csináljunk valamit a válasszal, ami a response objektumban lapul
            requestStuffFromDaServer();  // indítsuk az új lekérést
        }
});
}
```

Ez volna a javascript oldala nagyon leegyszerűsítve. Jöjjön a PHP oldala:

```
<pre data-language="php">class ApiController extends SomeController {

        public function __construct() {
              if (!$this->getRequest()->isPost()) // elkérjük a lekérésből generált Request objektumot és vizsgáljuk meg, hogy a lekérés POST request-e. Ez nem csak annyiból áll, hogy a $_POST tömböt vizsgáljuk, hanem megnézzük, hogy van-e benne a már korábban említett csrf_token és az valid-e, ha nem, akkor töröljük a $_POST tömböt és az isPost false-al térjen vissza.
                  return new JsonModel(array("success" => false)); // ez Zend2-féle megoldás, a lényeg, hogy ez a viewmodel beállítja a headert és json_encode-al átalakítja a kapott elemeket. Tehát a kimenetünk application/json lesz és a body-ban pedig egy {"success" : "false"} lesz, ezt a JS a response.success-ként látja majd.    
        }

        public function chatAction() {
            // mivel a konstruktorunk továbbengedett ide, ezért a lekérés post és valid is, így ezzel már nem kell foglalkozni.
            $messagemapper = $this->getServiceLocator()->get("MessageMapper"); // majd lesz szó a servicelocatorról is valamelyik cikkemben, most legyen elég annyi, hogy ennek a konfigurációjában beállítottuk, hogy a "MessageMapper"-re egy adott objektumot fog számunkra visszaadni, ami rajtra kész
           $uid = Session::getInstance()->get("uid"); // lekérjük a session-ből a hozzánk tartozó user id-t
           set_time_limit(0); // ezzel biztosítjuk, hogy ne dobjon ki a PHP max execution time-al.
           $trials = 0;
           $messages = false; // false értéket adunk neki 
           while ($trials < 10) { // megpróbáljuk 10x a lekérést
           $trials++;
           $messages = $messagemapper->get($uid); // ezt a userid-t használva lekérjük az üzeneteket, szimpla objektumok formájában
           if ($messages !== false) return new JsonModel(array("success" => true, "messages" => $messages)) // vagy amíg nem kapunk választ, ekkor visszaadjuk az üzeneteket is
           sleep(2); // és két másodpercet pihenünk két lekérés közt
           } 
           return new JsonModel(array("success" => false)); // ha pedig vége, akkor üresen megyünk vissza 
 }
}
```

A dolog gondolom nem bonyolult, persze lehet bonyolítani, ha ugye a már említett caching layereket beletesszük.

#### SSE

<figure aria-describedby="caption-attachment-345" class="wp-caption alignright" id="attachment_345" style="width: 640px">[![sse](assets/uploads/2015/02/sse-1024x577.png)](assets/uploads/2015/02/sse.png)<figcaption class="wp-caption-text" id="caption-attachment-345">Forrás: Stackoverflow</figcaption></figure>

Az SSE <del>egy SIMD utasításkészlet-kiterjesztés az </del> azaz Server-side events egy egyirányú kommunikációt biztosít a szerver felől a kliens felé. A lényege az, hogy miután megtörtént az oldal betöltődés, egy másodlagos kapcsolatot építünk ki JavaScript-el. A szerver pedig Json-ban kódolt event-eket küld nekünk, amit aztán feldolgozhatunk. Ez sajnos az imént említett chat-kliens esetében nem ideális, mert nekünk kétirányú kommunikációra lenne szükségünk, arról nem is beszélve, hogy sok böngészőnek (akik közül egy úgyse fog) még meg kell barátkoznia ezzel.

#### Websockets

Hatékonyság terén ez a megoldás a legjobb, ugyanis ezesetben a háttérben egy kétirányú kapcsolatot alakítunk ki, ami real-time képes adatot továbbítani és fogadni. A technika annyi, hogy a szerverünkön felállítunk egy külön websocket szervert, ami egy adott porton csücsül és a kliensünkön futó JavaScript pedig ennek küldözget adatot/fogad innen. Ez egy alacsonyabbszintű kommunikációt tesz lehetővé, mivel nem követi a HTTP protokollt, csupán a TCP-t (ami a HTTP alapját képezi), ezáltal nem kell fejlécekkel és hasonlókkal bajlódnunk, mi építhetjük föl az üzenetek szerkezetét.

Azonban itt is hasonló problémákba ütközünk, mint az SSE technológiánál, ugyanis a régebbi böngészők nem fogják bevenni a dolgot, ezzel pedig a long polling technikához kell visszatérjünk.

A lista viszont továbbra sem teljes, ugyanis akad mindenféle megoldás, pl. crossdomain lekérésekre (script src-ben megadott url-ek, stb.), amikre egy újabb ráérős napon akár kitérhetek.