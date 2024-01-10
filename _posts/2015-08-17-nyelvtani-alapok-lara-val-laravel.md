---
id: 589
title: 'Nyelvtani alapok.. Lara-val..Laravel'
date: '2015-08-17T20:16:52+02:00'
author: tacsiazuma
layout: post
guid: '{{ site.url }}/?p=589'
permalink: /2015/08/17/nyelvtani-alapok-lara-val-laravel/
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
    - '4041601136'
    - '4041601136'
categories:
    - Intermediate
    - Laravel
    - PHP
tags:
    - '5.0'
    - framework
    - guide
    - laravel
    - php
    - routing
    - structure
---

![laravel-for-web-artisans-1-638](assets/uploads/2015/08/laravel-for-web-artisans-1-638.jpg)Igen, eljutottunk ide is, mainstream keretrendszerekről is írok. Múltkor felmerült a kérdés a Zendes cikkem kapcsán, hogy miért pont Zend? Nos, habár sem magyar, sem világ viszonylatban nem egy elterjedt keretrendszerről van szó, a magyar nyelvű leírások száma igencsak csekély, az angol nyelvűek pedig nem feltétlenül írják le, hogy miért és hogyan, hanem csak copy pastere szánt kódokat kínálnak fel. (ellenben aki olvasta a szolid 1300 oldalas official doksit, annak respect és tisztelet)  
Na de mielőtt lázadást szítanék, amiért eltértem a témától, beszéljünk egy kicsit a laravelről.

A laravel beröccentéséhez mindenképp szükségünk lesz egy jól szituált [composerre]({{ site.url }}/2015/03/12/composer-a-php-fejlesztok-kedvenc-zeneszerzoje/). Ha ez megvan, és lehetőleg a $PATH-hoz is hozzáadtukm, akkor több módszerrel fel lehet rakni, de mi most a Laravel installert fogjuk használni. Ehhez az alábbi paranccsal fogunk indítani:

```
composer global require "laravel/installer=~1.1"
```

Ez globálisan telepíteni fogja nekünk a laravel installerét, így a későbbiekben bárhol vagyunk a fájlrendszerben, könnyedén tudjuk telepíteni azt, a következő módon:

```
laravel new [projekt-neve]
```

Ha mégsem ezt a módszert választjuk, akkor a composer create-project módszer is megteszi:

```
composer create-project laravel/laravel --prefer-dist [projekt-neve]
```

##### Zuhanjunk hát neki!

Ahogy a Zendes írásomnál, most is először végigjárjuk, hogy mit és hol találunk, mielőtt nekiesnénk a kódolásnak.

> Ebben a keretrendszerben már nem adtak annyit a backward compatibiltiy-re, ennélfogva PHP 5.5.9-től felfelé lehet szánkózni, valamint szükség lesz az alábbi kiterjesztésekre is a tökéletes működéshez: OpenSSL, PDO, MbString, Tokenizer.

Itt is a projekt/public mappára kell irányítanunk a Vhostunkat, amit ha fellőttünk és meglátogatunk, egy impresszív [![laravel5](assets/uploads/2015/08/laravel5.png)](assets/uploads/2015/08/laravel5.png)

kép fogad bennünket. Nem egy codeigniter welcome page, amibe beleoktrojálták a doksikat is, de sebaj, nem a frontenddel kell megerőltetni magunkat 🙂

Mit is találunk a projektben:

```
/app
/bootstrap
/resources
/vendor
/public
/storage
/database
/config
/tests
```

Akkor most nézzük át mi is található ezekben a könyvtárakban, mit hol találunk!

###### Vendor

Ezt kivételesen nem részletezném, ide kerülnek a 3rd party library-k, a'la composer.

###### Tests

Az alkalmazásunk teszteseteit tudjuk autentikusan ideszervezni. Alapból egy előregyártott teszt már található itt, arra vonatkozólag, hogy tényleg a Laravel 5 szöveget látjuk-e.

###### Storage

Ebbe a könyvtárba kerülnek a logfájlok, fájlrendszerbe cache-elt template-ek, session-ök (na meg amit mi ide akarunk rakni). Lévén, hogy ezeket PHP-vel generáljuk, a megfelelő írási permission-öket be kell állítani rá, hogy jól működjön a dolog.

###### Resources

Ez a könyvtár tartalmazza a view fájljainkat, a kulcs-érték párokba szervezett tömbökkel tömött nyelvi fájlokat, valamint ide rakhatjuk a compile-ra váró .scss és less fájlokat is.

###### Database

Az adatbázis migrációra vonatkozó generált fájlok kerülnek ide.

###### Public

A webszerver által kiszolgálható tartalom kerül ide (js/css/képek,favicon, stb.), az index.php-val egyetemben.

###### Config

Bármilyen meglepő is, a konfigurációs fájlok fognak ez alá a könyvtár alá gyűlni.

###### Bootstrap

Az alkalmazásunk elindulásakor itt rántjuk be az autoloadereket és példányosítjuk az application osztályunkat.

###### App

Ez lesz a tényleges alkalmazásunknak helyet adó könyvtár, amit tüzetesebben is meg kell vizsgálnunk!

```
/Console
/Events
/Http
/Exceptions
/Jobs
/Listeners
/Providers
User.php
```

Mivel weboldalunkat nem console-ból fogják elérni a felhasználók, ezért egyelőre lekorlátozzuk a dolgot a Http könyvtár tartalmára.

```
/Controllers/Middleware
/Requests
Kernel.php
routes.php
```

#### Routing

Hacsak nem valami angular powered one-page application-t akarunk csinálni, akkor bizony (sőt, még akkor is) szükség lesz route-ok felállítására. Ezt a routes.php-ben tudjuk majd megtenni. Nézzünk bele és lessük meg hogy is működik!

```
Route::get('/', function () {
    return view('welcome');
});
```

Nem valami sok igaz? A fenti példa csupán annyit csinál, hogy a "/"-re visszadob egy template-et.

> Ezek a templatek a resources/views mappában találhatóak és ".blade.php"-val a végükön. Próbáljuk ki, hogy átnevezzük az ott található welcome.blade.php-t. Rögtön egy exception oldalra kerülünk a Laravel 5 felirat helyett.

Route-okat ebben a fájlban tudunk definiálni ezen ún. Route [facade](https://en.wikipedia.org/wiki/Facade_pattern) segítségével.

A használata betonegyszerű:

A Route osztály statikus metódusai követik a HTTP request metódusokat. Tehát létezik belőle get, post, put, stb. Ha több metódusra is rá akarjuk aggatni a dolgot, használhatjuk a Route::any-t.

Nézzünk pár példát!

```
Route::post("/login", function() {
});
```

A fenti route a /login-ra van ráaggatva, de csak POST esetében. Ha szimpla GET kérést indítunk oda, egy jóféle 404-es hibaoldal fogad.

```
Route::match(array('get', 'post'), "/login" , function () {
})
```

Ez a módszer már a GET és a POST kérésekre is hallgat.

Viszont ez az anonymous function dolog rossz javascript-es élményeket idéz, úgyhogy okkal merül fel a kérdés: mégis hogy tudjuk ezeket a route-okat controllerekhez és azok metódusaihoz kötni?

Szerencsénkre ez roppant egyszerű:

```
Route::get('/login', 'AuthController@login');
```

A fenti példában a login get kérésére az AuthController osztályunk login metódusa kerül meghívásra. Ügyeljünk a kis- és nagybetűkre, mert case-sensitive a cucc.

De mi van akkor, ha szeretnénk route paramétereket is alkalmazni? Mi sem egyszerűbb!

```
Route::get("/post/{id}", "PostController@view");
```

A fenti módszerrel a /post/ után bármi következhet, paraméterként elérhető lesz a controllerünkből:

```
$id = $route->input('id');
```

De mi van akkor, ha az ID-k formátumát le szeretnénk korlátozni? Ezt többféle módon meg tudjuk tenni:

```
Route::get("/post/{id}", "PostController@view")->where("id", '[0-9]+');
```

Ezzel a módszerrel az egyes route-ok paraméterei tudunk reguláris kifejezésekkel szabályokat aggatni.

Viszont azt is megtehetjük, hogy az összes id nevű paraméterre ráhúzunk egy hasonló regexpes szabályt. Ehhez a routes.php-n kívül kell mozdulnunk, mégpedig a /app/Providers/RouteServiceProvider.php fájlba, azon belül is a boot metódusba.

Itt tudunk globális szabályokat aggatni a Route osztályunkra (model binding, parameter patterns).

```
public function boot(Router $router)
{
    $router->pattern("id",'[0-9]+');
    parent::boot($router);
}
```

Ezek a paraméterek lehetnek opcionálisak is, ha a nevük végére odabiggyesztjük a C#-ból ismert '?'-t (nullable).

```
Route::get("/post/{id?}", "PostController@view");
```

Ebben a formában a /post/ és a /post/akarmi is ugyanezt a route-ot fogja triggerelni.

Az egyes route-jainknak nevet is adhatunk, ha a következő formában asszoc tömböt kapnak második paraméterként:

```
Route::get("/", [ 'as' => 'home', 'uses' => 'PostController@list'] );
```

Ez akkor lehet fontos, ha nem bedrótozott URL-eket akarunk használni, hanem URL helpereket, amik összeszüttyögik számunkra az URL-eket:

```
$url = route('home');
```

##### Route group

Na de most gondoljunk bele, hogy mi lesz itt, ha egy igazán nagy alkalmazást szeretnénk fejleszteni? Route tenger, amiben könnyedén el lehet veszni, úgyhogy nem ártana némileg rendszerezni őket. Erre szolgálnak pl. az ún. route group-ok, viszont funkcionalitásuk közel sem áll meg ezen a szinten.

A csoportokra bizonyos szabályokat tudunk így ráereszteni. Ilyen lehet pl. bizonyos middleware-ek definiálása egy adott csoportra.

[![po9an](assets/uploads/2015/08/po9an.jpg)](assets/uploads/2015/08/po9an.jpg)

> A middleware-ek<del> a hardware és a software között elhelyezkedő nyúlós, de nem ragadós</del> alkalmasak arra, hogy az alkalmazásba beérkező HTTP kéréseken különböző műveleteket/ellenőrzéseket hajtsanak végre mielőtt az adott controller metódusához érkeznének. Képesek lehetnek akár redirektálni a kérést, logolni azt, <del>el die()-oltatni a \*\*\*\*be</del> stb. Ilyen beépített middleware például az autentikációra specializálódott, ami a sikertelen autentikáció esetén a loginoldalra redirektálja a felhasználót, a kért tartalom kiszolgálása helyett. Ezek definiálása egy későbbi cikkbe fér majd bele.

```
Route::group(["middleware" => ["auth"]], function() {
// az alábbi route-okra a dispatch előtt ráakasztjuk az auth nevű middleware-ünket. Többet is megadhatunk, amik a tömbbeli indexük szerinti sorrendben lesznek meghívva
    Route::get("/posts", "PostController@list");
    ...
});
```

Alapesetben a controllerjeink a App\\Http\\Controllers névtérben találhatóak, ahogy az a RouteServiceProviderben definiálva van. Ha ezen kívül esnek, akkor a Controller@method páros prefixálnunk kell az adott névtérrel. Ha több controllert mozgatnánk ide-oda, akkor azért ez már elég sok prefixálgatni való, amit megspórolhatunk szintén Route group-okkal:

```
Route::group(["namespace" => "Blog"], function() {
// a controllerünk az App\Http\Controllers\Blog névtérben van
    Route::get("/posts", "PostController@list");
    ...
});
```

> Ne feledjük, az alábbi groupokat lehet kombinálni is, csak az első paraméterben található tömb elemeit kell összefűznünk!

Na de mi van akkor, ha nem a névtereinket akarjuk prefixálni, hanem a route-jainkat?

```
Route::group(["prefix" => "posts"], function() {
          Route::get("/", "PostController@list"); // a /posts-ra hívódik meg
          Route::get("{id}", "PostController@view")->where("id", "[0-9]+"); // a /posts/434 -ra meghívódik, viszont a /posts/aaaa-ra már nem.
});
```

Na és mi a helyzet a sub-domain route-okkal?

Tegyük fel, hogy szeretnénk egy slack-hez hasonló szolgáltatást indítani?

```
Route::group(["domain" => "{account}.slack.com"],  function() {
 // ha letscode.slack.com-on hívom meg, akkor az account paraméterben, bizony ott lesz a "letscode" string.
            Route::get("/", "AccountController@dashboard"); 
});
```

Na de akkor most jöjjön valami igazi finomság...

##### Route Model binding

Laravelben lehetőségünk van arra, hogy egyes route paramétereink ne szimpla stringek legyenek, hanem objektumpéldányok, ahogy pl. .NET-ben. Ahhoz, hogy ezt megtegyük, első körben szükségünk lesz a következőkre:

Nyissuk meg a RouteServiceProvider-ünket és a boot metódusba oktrojáljuk bele a következőt:

```
<pre class=" language-php" data-language="php">$router->model('post', 'App\Models\Post');
```

Ha ezzel megvolnánk, akkor szükségünk lesz egy olyan route-ra, ami használja a post nevű paramétert:

Route::get("/view/{post}", "PostController@view");

Na meg szükségünk lesz egy Post osztályra, úgyhogy az app könyvtáron belül hozzunk létre egy Models könyvtárat és azon belül pedig egy Post osztályt:

```
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Post extends Model { // extendelnie kell a Model osztályt

    protected $table = 'posts'; // valamint meg kell határoznunk a tábla nevét

}
```

A fenti a minimum, ami szükséges ahhoz, hogy a modellünket beinjektáljuk az adott actionbe. A table változó jól mutatja, hogy szükséges lesz egy posts nevű tábla az adott adatbázisban, aminek pedig kell egy id field, ami alapján keresni fogja az adatbázisban az adott rekordot. Tehát mikor a /view/1 -es route-ra tévedünk, akkor a posts táblában levő 1-es id-jú rekordot lekéri, a mezőit beletölti az objektumba és azt adja át paraméterként.

Most akkor nyissuk meg a PostControllerünket:

```
<?php

namespace App\Http\Controllers;


class PostController extends Controller {

    public function view(\App\Models\Post $post) {
        var_dump($post); // itt láthatjuk majd az osztályt, feltöltve minden földi jóval
    }
}
```

Persze jobban személyre lehet szabni a dolgokat, megadhatunk másik primary key-t ami alapján keres, stb. Ha az adott id-vel nem található elem, akkor egy 404 oldalra kerülünk.

Első körben legyen elég ennyit szerettem volna, a későbbiekben is érkezem... majd még megsavazza a nép, hogy épp mivel!
