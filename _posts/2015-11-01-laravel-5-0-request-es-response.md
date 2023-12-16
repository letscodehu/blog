---
id: 802
title: 'Laravel 5.0 &#8211; Request és Response'
date: '2015-11-01T23:31:47+01:00'
author: tacsiazuma
layout: post
guid: '{{ site.url }}/?p=802'
permalink: /2015/11/01/laravel-5-0-request-es-response/
dsq_thread_id:
    - '4280912074'
    - '4280912074'
categories:
    - Intermediate
    - Laravel
tags:
    - framework
    - laravel
    - request
    - response
---

Az előző részekben átvettük hogy is épül fel egy átlagos laravel alkalmazás könyvtárstruktúrája, hogy lehet route-okat definiálni, valamint szóba kerültek a controllerek és middleware-ek.

Mivel többségében ezeket az alkalmazásokat webre tervezzük és használjuk, ezért most térjünk kicsit vissza a protokoll alapjaihoz. Amikor a böngészőbe bepötyögünk egy URL-t és rátalál a böngészőnk a megfelelő IP-re, akkor egy HTTP requestet küld el a szervernek, amit az feldolgozva egy HTTP response-al "jutalmaz". Ugye ezeknek a requesteknek van headerje és body-ja, (ahogy ez a response-ra is igaz) POST, GET paraméterek, stb. A response-nak statuscode, statusmessage, body, header, stb.

Ezt a request-response dolgot megvalósítja a laravel is, mégpedig objektumok mentén. Tehát amikor befut a kérés a controllerünk adott metódusába, akkor a service containerünkben már ott csücsül egy az aktuális bejövő kérés adataival feltöltött Request objektum.

### Request

Ezt a Requestet több módon tudjuk elérni. Első példa a Request facade-ből. A múltkor létrehozott kontrollerünk egyik metódusában kérjük ki például az egyik POST mezőt, ez következőképp fest:

```
<pre data-language="php">use Request; // ez esetben a gyökér névtérben lévő Request-et használjuk
$egyPostMezo = Request::input("egy-post-mezo");
```

> A fentiekhez természetesen az adott route-ot fel kell venni a már ismert Route::post v. Route::any statikus metódusok használatával.

Ez a módszer több helyről képes kinyerni azt az input mezőt a POST, GET paraméterek közül, ez előbbit részesítve előnyben. Viszont a Facade használatát én személy szerint nem túlzottan szeretem, mivel a dependency injection híve vagyok (így könnyen kimockolhatjuk az adott requestet), ezért most a service containerből kérjük ki a példányunkat:

```
<pre data-language="php"><?php 
namespace App\Http\Controllers;

use Illuminate\Http\Request; // HTTP request !
use Illuminate\Routing\Controller;

class UserController extends Controller {

    public function store(Request $request) // DI, I love it.
    {
       $egyPostMezo = $request->input('egy-post-mezo'); // itt pedig kikérjük ugyanazt a változót
    }

}
```

Ha az adott paraméter nincs jelen, akkor alapesetben null értékkel tér vissza, de második paraméterként átadhatjuk a default értéket:

```
<pre data-language="php">$request->input("egy-post-mezo", "default-value");
```

Persze a fenti megoldás nem mindig jó, ezért ahogy az általános key-value containereknél megszoktuk, létezik egy has metódus is, amivel lecsekkolhatjuk, hogy az adott mező kitöltésre került-e?

```
<pre data-language="php">if ($request->has("egy-post-mezo")) { /* ha ki van töltve */ }
```

Persze lehetőségünk van kikérni az összes mezőt:

```
<pre data-language="php">$request->all();
```

Viszont vannak esetek, amikor nem kellenek csak egyes mezők:

```
<pre data-language="php">$request->only("test", "trollok"); // nem kell tömbként átadni
$request->only(array("test", "trollok"));  // persze a régi módszer is működik
```

...vagy épp egyes mezők nem kellenek:

```
<pre data-language="php">$request->except("test", "trollok"); // itt is működik a régi módszer
```

Ha tömbökkel dolgozunk, akkor azokat a dot notation mintájára tudjuk megadni:

```
<pre data-language="php">$request->input("test.0.trollok"); // a test[0]["trollok"] értékét adja vissza
```

#### Az előző request

Laravelben lehetőségünk van arra, hogy request-ek közt átvigyük ezeket az input adatokat. Ott lehet ez hasznos, mikor például egy kitöltött űrlap adatait akarjuk átvinni a következő megjelenítésre, mert fel szeretnénk tölteni azt, hogy ne kelljen minden mezőt újra bepötyögnie a felhasználónak. Erre a laravel egy egyszerű módszert nyújt, amivel az inputokat a sessionben le tudjuk tárolni a következő request erejéig, utána azokat kidobja onnan:

```
<pre data-language="php">$request->flash(); // az összes input mezőt tárolja
$request->flashOnly("csak", "ezeket", "a" ,"mezoket", "tarolja");
$request->flashExcept("csak", "ezeket", "a" ,"mezoket", "nem", "tarolja");
```

A következő requestben ha nem töltjük fel újra a formot, akkor az adat elveszik a sessionből.

Mivel az esetek döntő többségében az input sessionben tárolása egy oldalra átirányítással együtt történik, ezért ennek megkönnyítésére a redirect-et lehet chainelni a flash-el:

```
<pre data-language="php">return redirect("form-kitoltes")->withInput(); // az összes input mezőt átadja
return redirect("login-form-kitoltes")->withInput($request-except("password"));  // a jelszómezőt kivéve minden mezőt visszaad
```

Ez ismét szép, meg jó, de hogy érem el ezeket a sessionbe mentett értékeket?

Erre való az "old" metódus, ami a sessionben flash-elt változókat kinyeri, hasonló szintaktikával, ahogy az input tette.

```
<pre data-language="php">$username = $request->old("username") // a username mező sessionben tárolt értékét adja vissza
```

Erre létezik egy view helper is, így ha <del>angular two-way data-bindingot</del> blade templateket használunk, akkor írhatjuk a következőképpen is, magában a template-ben:

```
<pre data-language="html">{{ old('username') }}
```

#### Na és mi a helyzet a sütikkel?[![tumblr_ncnipjhaE81tglqsno1_1280](assets/uploads/2015/11/tumblr_ncnipjhaE81tglqsno1_1280.jpg)](assets/uploads/2015/11/tumblr_ncnipjhaE81tglqsno1_1280.jpg)

A Laravel által kreált sütik titkosítva vannak és aláírásra kerülnek egy authentikációs kóddal, ennélfogva ha a kliens által módosításra kerülnek, akkor invalidnak számítanak. Ezeket a sütiket is a requesten át tudjuk elérni a facade-en át vagy épp a request példányból:

```
<pre data-language="php">$test = Request::cookie('test');
$test = $request->cookie("test");

```

A sütik létrehozásához használhatjuk a cookie() helpert:

```
<pre data-language="php">$cookie = cookie('cookie-neve', 'cookie-erteke', $percekSzama);
```

Ahhoz, hogy a HTTP válaszban egy új cookie-val térjünk vissza, az előbbi módon előállított sütit hozzá kell csapjuk ahhoz:

```
<pre data-language="php">$response->withCookies($cookie);
```

Ha nem szeretnénk minden egyes response-hoz ezt hozzácsapni, akkor ún. várólistára is tehetjük a sütinket, már azelőtt, hogy a response objektumot létrehoztuk volna. Ezzel egy pontra fókuszálhatjuk a sütijeink kezelésének logikáját:

```
<pre data-language="php">Cookie::queue('cookie-neve', 'cookie-erteke');
```

> Ezt csak a facade-en keresztül tudjuk megtenni.

[![files1](assets/uploads/2015/11/files1.jpg)](assets/uploads/2015/11/files1.jpg)

#### Jöjjenek a feltöltésre szánt fájlok!

A feltöltött fájlokat szintén a Request objektumból tudjuk lekérni:

```
<pre data-language="php">$file = $request->file("file-mezo-neve");

```

Ez egy UploadedFile objektummal tér vissza, ami a PHP SplFileInfo objektumból van származtatva, ennélfogva alapból elég sok metódust préseltek bele, amin keresztül különböző információkat kérhetünk le róla.

Természetesen itt is lehetőségünk van egyszerűen lekérdezni, hogy az adott fájl feltöltésre került-e egyáltalán:

```
<pre data-language="php">$uploadedOrNot = $request->hasFile("file-mezo-neve");
```

A feltöltött fájlokat ezen objektumon át tudjuk könnyedén mozgatni:

```
<pre data-language="php">$request->file("file-mezo-neve")->move("/cel/konyvtar"); // itt megtartjuk a fájlnevet

$request->file("file-mezo-neve")->move("/cel/konyvtar", "file.kiterjesztes");

```

Számos egyéb dolgot tudunk még a requestünkkel tenni:

Lekérdezhetjük a request URL-jét:

```
<pre data-language="php">$url = $request->url();
```

Megvizsgálhatjuk, hogy az adott kérés AJAX-e?

```
<pre data-language="php">if ($request->ajax()) { /// }
```

és még sok mást, de azért mindent nem tudom felsorolni, mert a response-nak is kell hely 🙂

### Response

Ahhoz, hogy valamit tapasztaljon a felhasználó az oldalunkból, mindenképp szükség van visszaküldeni számára egy választ. A laravelben többféle válasz létezik, ezek közül a legegyszerűbb egy szimpla string:

```
<pre data-language="php">Route::get("/", function() {
    return "ez itt egy response";
});
```

Persze ez nem túl szép, ennélfogva a legtöbb esetben a kérés feldolgozását egy controller-action végzi, ami egy Response objektummal vagy épp view-al fog visszatérni. Ha nem view-val, hanem response objektummal térünk vissza, az lehetővé teszi számunkra, hogy módosítsuk a HTTP status code-ot, header-öket, stb. Ennélfogva ez fog full kontrolt adni a válasz felett, de az esetek többségében egy szimpla view is elég lesz (amit aztán a Laravel persze egy default response-ba fog ágyazni).

Példányosításkor két paramétert vár el, egy contentet és egy statust:

```
<pre data-language="php">return new Response('ez itt a content', "403 YOUHAVENOPOWERHERE");
```

Persze itt is szépen lehet chainelni a dolgokat, hogy még jobban testreszabjuk a választ:

```
<pre data-language="php">return (new Response('ez itt a content', "403 YOUHAVENOPOWERHERE"))->header("Content-type", "text/plain"); // bónusz header
```

Persze használhatjuk a response() helpert is, valamint meghatározhatjuk, hogy melyik view tartalmát szeretnénk:

```
<pre data-language="php">return response()->view("home")->header("Content-type", "text/plain"); // bónusz header és view-ként a home-ot használjuk
```

A sütikre is ugyanúgy van lehetőség, ahogy már fentebb is említettem, valamint változókat is lehet flashelni a sessionbe, hogy tovább cifrázzuk a method chaininget:

```
<pre data-language="php">return response()->view("login")->withCookie(cookie("trials", $trials))->flashExcept("password")->header("Content-type", "text/plain"); // bónusz header és view-ként a logint használjuk, a password kivételével minden input változót átadunk sessionben és sütiként beállítjuk a sikertelen belépések számát
```

#### Redirect

A string, a view és a response után a negyedik lehetőség, amivel visszatérhetünk, az a redirect. Ez igazából egy RedirectResponse objektum, ami annyiban különbözik a sima response-tól, hogy már fel van töltve a szükséges headerökkel, amik a redirektáláshoz szükségesek.

Mivel elég ritka eset, hogy egy redirect objektumot mockolnánk ki, ezért ez esetben a redirect helper használata általában elég:

```
<pre data-language="php">return redirect("admin/login"); // az admin/login URL-re redirectáljuk a kérést
```

Persze ha lehet ne használjunk beégetett url-eket, inkább az egyes már korábban névvel ellátott route-okra redirektáljuk a népet:

```
<pre data-language="php">return redirect()->route("login"); // a login nevű route-ra redirektáltunk
```

Lehetőségünk van SESSION-be mentett adatokkal redirektálni a kérést:

```
<pre data-language="php">return redirect()->route("login")->with("session-kulcs", "session-ertek"); // átirányítjuk a felhasználót és sessionben letárolunk az adott kérés erejéig egy kulcs-érték párt
```

Valamint vannak esetek, mikor vissza akarjuk redirektálni a felhasználót az előző URL-re, pl. egy form hibás kitöltésekor:

```
<pre data-language="php">return redirect()->back(); // visszairányítjuk a felhasználót
```

Ha akarjuk, akkor nem csak egyszerű literális route-okra irányíthatjuk a kérést, hanem paramétereket is átadhatunk annak:

```
<pre data-language="php">return redirect()->route("post", [$slug]);
```

Ha olyan route-ra irányítanánk át a felhasználót, aminek ID-ja alapján kerül feltöltésre egy modelünk, szimplán a modelt is átadhatjuk:

```
<pre data-language="php">return redirect()->route("post", [$postObject]);
```

Valamint használhatunk explicit controller-action párost is:

```
<pre data-language="php">return redirect()->action("ControllerNeve@metodusNeve");
```

paraméterekkel:

```
<pre data-language="php">return redirect()->action("ControllerNeve@metodusNeve", ['user' => 6]); // a controllerneve->metodusNeve lesz meghívva és paraméterként megkapják a user-t, 6-os értékkel.
```

#### Speciális válaszok

Vannak esetek, mikor nem egy szimpla HTML oldalt akarunk visszaadni, hanem pl. JSON-t. Erre az esetre:

```
<pre data-language="php">return response()->json(['user' => 6]); // a json metódus automatikusan beállítja a content-type-ot application/json-re
```

Ha fájlt akarunk letölteni, akkor arra is létezik egy roppant egyszerű megoldás:

```
<pre data-language="php">return response()->download($fileNeve); // a fájl nevét kell megadni és annak tartalma bele lesz csatornázva a válaszba
return response()->download($fileNeve, $kivantNev, $headers); // második paraméterként megadhatunk neki egy nevet, amivel menti alapértelmezetten, valamint egyéb headeröket is felvehetünk

return response()->download($fileNeve)->deleteFileAfterSend(true); // valamint lehetőségünk van arra is, hogy utána töröljük a fájlt és ne szemeteljük tele a szerverünket.
```

Így hirtelenjében ennyi jutott eszembe, legközelebb belemegyünk a különböző view megoldások kitárgyalásába!