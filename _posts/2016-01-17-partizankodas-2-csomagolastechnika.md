---
id: 968
title: 'Partizánkodás 2 &#8211; Csomagolástechnika'
date: '2016-01-17T12:21:33+01:00'
author: tacsiazuma
layout: post
guid: '{{ site.url }}/?p=968'
permalink: /2016/01/17/partizankodas-2-csomagolastechnika/
dsq_thread_id:
    - '4498656392'
    - '4498656392'
newsphere-meta-content-alignment:
    - align-content-left
image: 'assets/uploads/2016/01/09202024/Package-0-scaled.jpg'
categories:
    - Laravel
    - PHP
tags:
    - artisan
    - command
    - composer
    - laravel
    - package
    - php
    - serviceprovider
---

Amikor az ember fejlesztésbe kezd, és eljut arra a pontra, hogy egy kódrészletet átmásol A helyről B-be, akkor a józan ész azt diktálja, hogy bizony ezt lehetne szebben is csinálni. Azt a részt, amit átmásoltunk, kívülről konfigurálhatóvá tehetnénk, és újrahasznosíthatnánk a B helyen, ezzel megspórolva X sornyi kódot. Ebből születnek a függvények, amikből aztán osztályok lesznek és végül megszületik az első saját kis függvénykönyvtárunk. Ezeknek a függvénykönyvtáraknak a menedzselésére szolgál a a composer, amiről már korábban is [írtam]({{ site.url }}/2015/03/12/composer-a-php-fejlesztok-kedvenc-zeneszerzoje/). Ehhez fogunk most magunknak egy csomagot készíteni, a saját kis repositorynk egyikében, lecsekkoljuk, hogy működik-e és ha igen, akkor nekilátunk összerakni a laravelhez illeszthető csomagunkat, amivel a saját kis admin felületünket legeneráljuk. Ha ez kész, ennek mintájára több felülethez is készíthetünk ilyen generátor könyvtárat.[![Package-0](assets/uploads/2016/01/Package-0-1024x808.jpg)](assets/uploads/2016/01/Package-0.jpg)

Ahhoz, hogy valid composer package-et hozzunk létre, mindenképp szükségünk lesz egy composer.json fájlra a projektünk gyökerében. Ebben fogjuk megadni a projekt nevét, függőségeket, stb. Hozzunk létre egy új könyvtárat valahol, amit később git verziókövetni fogunk. A gyökerében hozzunk létre egy composer.json fájlt (le is generálhatjuk composer inittel, ha már menők vagyunk):

```
{
	"name": "letscode/admin-interface", // ez pedig az elnevezés, ez alapján fogja a könyvtáratakat is legenerálni a composer
	"description": "A database interface package for Laravel", // leírás
	"homepage": "http://letscode.hu", // honlapunk, ha valaki esetleg a csomag után érdeklődne, ez privát csomagok esetén irreleváns
	"license": "MIT", // a licensz, amivel a csomagot elérhetővé tesszük
	"authors": [ // itt sorakoznak a fejlesztésben/fordításban részt vevők
		{
			"name": "Papp Krisztian", // név, itt vigyázzunk az ékezetekre, nem mindig szereti a composer
			"email": "fejlesztes@letscode.hu" // e-mail címünk
		}
	],
	"require": {
		"php": ">=5.5.0",  // ennél nagyobb PHP-t igényel majd a cucc, amit alkotunk, igaz ez annyira nem kardinális, lévén a laravel framework 5.6-ért fog sikítani
		"laravel/framework": "5.*", // elvileg elég az illuminate/support is, de még kiderül
		"ckeditor/ckeditor": "4.*" // a ckeditort fogjuk használni wysiwyg editornak
	},
	"autoload": {
		"psr-4": {
			"Letscode\\Admin": "src/" // az src mappa tartalmát behúzzuk autoloaderrel, tehát az src mappában lévő fájlokat úgy veszi, hogy a Letscode\Admin névtéren belül vannak
		}
	},
}
```

Ezek után hozzunk létre egy könyvtárat a projekt gyökerében, src néven. Ide fog kerülni a forráskódunk.

Hozzunk létre itt egy git repository-t és adjuk hozzá a .gitignore fájlhoz a vendor és a composer.lock bejegyzéseket. A függőségeket és a composerünk által generált fájlt természetesen nem akarjuk verziókövetni. Az elsőt a composer kezeli majd, a második pedig generált fájl, ez az összes generált fájlra igaz lesz majd.[![b0e7bff9449132bca6331de356271213](assets/uploads/2016/01/b0e7bff9449132bca6331de356271213-1024x576.jpg)](assets/uploads/2016/01/b0e7bff9449132bca6331de356271213.jpg)

Ha ezek után lefuttatjuk a composer install-t, akkor belövi nekünk a névtereket, lehúzza a függőségeket és már kész is vagyunk arra, hogy használjuk a csomagot. (már ha előtte behúztuk a composer által generált autoloadereket a vendor/autoload.php-ból).

Hozzunk létre az src mappában egy AdminInterfaceProvider.php-t:

```
<?php 

namespace Letscode\Admin;

use Illuminate\Support\ServiceProvider; // emiatt kell az illuminate/support

class AdminInterfaceProvider extends ServiceProvider {

    public function boot() {

    }

    public function register() {

    }
}
```

Itt hozzunk létre egy tests mappát is, amiben helyezzük el a ProviderTest.php-t:

> Ez nem lesz igazi teszt, csak arra vagyunk kíváncsiak, hogy az autoloaderek jól összeálltak-e

```
<?php

require "../vendor/autoload.php"; // behúzzuk az autoloadert

$l = new Letscode\Admin\AdminInterfaceProvider(new \Illuminate\Foundation\Application()); // példányosítjuk a providert és átadjuk neki paraméterként az application objektumpéldányt.
```

Ha a fenti kód hiba nélkül lefut, akkor összeolajozódtak az autoloaderek, minden csomag a helyén van. Ezt toljuk is be a repóba (egyelőre a master ágba), majd térjünk vissza a laravel projektünkhöz, amit az [előző alkalommal]({{ site.url }}/2016/01/11/partizankodjunk-a-laravel-5-el/) csináltunk. Itt el kell érjük, hogy a composer az imént létrehozott projektet lehúzza a saját privát helyünkről.

Ehhez fel kell vennünk a projektünk composer.json-jébe a következőt:

```
"repositories": [
  {
   "url": "http://eleresi-ut/a/sajat/reponkhoz.git", // a repo-k közé felvesszük a sajátunkat, lévén a mi csomagunk nincs publikálva packagistre
   "type": "git"
  }
],
"require": {
   "laravel/framework": "5.0.*", // ugye a projektünk alapból behúzta a laravelt, ezzel röffentettük be
   "letscode/admin-interface" : "dev-master" // itt adjuk hozzá, mégpedig a master ágat
}
```

> **Megjegyzés:** Mivel repository-ként vettük fel a csomagot, ezért a composer lesz olyan jófej, hogy direktbe oda klónozza a repót, így közvetlenül ott is elérjük azt, így a frameworkbe illesztve tudunk benne javításokat eszközölni, anélkül hogy submodule-ként be kellene húzni azt.

[![h-o-w-darker](assets/uploads/2016/01/h-o-w-darker.png)](assets/uploads/2016/01/h-o-w-darker.png)

Ha mindent jól csináltunk, akkor egy composer update után, a fájlok, névterek és minden a helyén van. Ezt legegyszerűbben úgy tudjuk ellenőrízni, ha a fent létrehozott providerünket beregisztráljuk. Ha valami nem jól lett volna összeröffentve, akkor ott biztos hibát dobna. Vegyük fel hát a config/app.php-ban:

```
$providers => [
 // többi provider
    'Letscode\Admin\AdminInterfaceProvider'
];
```

Ezután pedig futtassuk a php artisan parancsot. Lévén nem vettünk még fel commandot, ezért nem fog extra megjelenni, de ha nem találná a providerünket, akkor csúnya class not found exceptionnel zárulna a mai napunk.

Most, hogy ezzel megvagyunk, elkezdhetünk benne valami kódot ügyködni, nemde?

A csomagunk könyvtárszerkezete a következőképp fog alakulni:

```
src/ #forráskódunk
     Commands/ # a commandok kerülnek ide értelemszerűen 
     Controllers/ # a kontroller osztályaink
     Models/ # a model osztályaink
     Middlewares / # a middleware-jeink
     AdminInterfaceProvider.php # a provider osztályunk
tests/  # tesztjeink majd ide kerülnek. Lévén a saját dolgainkat akarjuk tesztelni és nem a keretrendszert, ezért jelenleg nem sok mindent tudunk letesztelni
assets/ # a public mappába innen fognak kerülni a css-ek, js-ek, stb.
views/ # a view fájlok
stub/  # a publikálandó osztályok váza, erről mindjárt szó lesz
```

#### Mi a gránát lesz ez a STUB?

Nos a helyzet az, hogy csomagunk a következőképp fog működni:

- A vendor mappában lesz pár controller, model, amikbe fogunk dolgozni.
- Ha valaki használni akarja azt, akkor számára az lenne a legegyszerűbb, hogy továbbörökíti azt a saját osztályában, az app/Http/Controllers mappában, ezáltal lehetősége nyílik testreszabni azt.
- Mi ezt a megvalósítást akarjuk a másik számára leegyszerűsíteni, mégpedig úgy, hogy legeneráljuk neki ott az extendelt osztálydefiníciókat, hogy instant használatba tudja venni (ez a generálás elég erős, de erről később)
- Ezen felül a helyükre kerülnek a stock view fájlok is hozzá, valamint a routing is be lesz húzva.

Nagy szerencsénk van, mert a laravelben létezik egy command arra, ami a beregisztrált csomagokat számunkra az általunk megadott helyükre tegye. Viszont itt nincs lehetőség semmiféle testreszabásra, ezért létrehozzuk a saját parancsunkat, amivel némi finomhangolást tudunk végezni, mielőtt nekiállnánk publisholni azt.

Na de térjünk csak vissza a stubra. Ugye generálni lehetne úgy is a fájlokat, hogy szépen tokenekből felépítenénk azt, mielőtt beolvastunk X fájlt, ellenőríztünk névtereket, stb. Viszont jelen esetben nem lesz erre szükség, mert pontosan tudjuk, hogy mit akarunk az adott fájlba írni, maximum az osztály neve és egy névtér változhat, nemde? Tegyük fel, hogy írtunk egy controller osztályt a vendorban. Tegyük is azt meg:

```
<?php
// /vendor/letscode/admin-interface/src/Controllers/AdminController.php

namespace Letscode\Admin\Controllers;

use Illuminate\Routing\Controller; // a laravel base controller osztálya

class AdminController extends Controller
{
  public function index() {
      return "múkodik"; // a teszt erejéig
  }
}
```

Most, hogy ez megvan, nézzük meg hogy is használnánk mindezt az app könyvtárunkban:

```
<?php
// app/Http/Controllers/Admin/AdminController.php

namespace App\Http\Controllers\Admin;

use Letscode\Admin\Controllers\AdminController as ParentController; // parentcontrollerként hivatkozunk a leörökítettre

class AdminController extends ParentController
{
   // egyelőre nem bővítjük semmivel
}
```

\> A fenti osztályra fogunk egy stub-ot létrehozni a csomagunkban. Ez a stub (illetve egy olyan, ahol pl. az AdminController szót lecseréljük {controllername}-re, a későbbi string replace miatt) lesz az, amit majd egy temporary helyre másolunk, módosításokat végzünk rajta (a bizonyos string replace és társai), majd onnan publisholjuk azt.

Most kössünk rá egy route-ot az app/Http/routes.php-ben és nézzük meg, hogy működik-e:

```
Route::get('/', 'Admin\AdminController@index');
```

Ha megpingeljük a hostunkat és minden csillag jól összeállt <del>mint kislányok a csoportselfiehez</del>, akkor a böngészőben megjelent a múkodik szöveg.

Na most akkor nézzük meg mi is ez a bizonyos publish. Egyelőre nem fogunk belemenni a testreszabásra, csupán arra, hogy a routing, stb. kikerüljön.

#### Vendor:publish

Amikor kiadjuk a **php artisan vendor:publish** parancsot, akkor a laravel végrehajtja az összes beregisztrált publish folyamatot, amiket a serviceproviderekben megadtunk.

> **Fontos!** Ha olyan csomagot fejlesztünk, amibe nem akarunk projekt specifikusan belenyúlni, akkor nem lesz szükségünk a publish-re, csupán be kell regisztrálni a view-kat, route-okat a serviceproviderben.

Először kezdjük a stub controllerekkel. A serviceproviderünk boot metódusába másoljuk be az alábbiakat:

```
$this->publishes([
    __DIR__.'/../stub/AdminController.php' => base_path('app/Http/Controllers/Admin/AdminController.php'),
]); // ez a stub könyvtárból átmásolja az admincontrollert a megadott helyre. Ha könyvtárat adunk meg, akkor annak teljes tartalmát átmásolja a célhelyre.
```

Ezek után töröljük az imént bemásolt fájlt az Admin mappa alól, nem akarjuk hogy megtévesszen minket nemde? Majd futtassuk a fenti parancsot és láss csodát:[![xhw09](assets/uploads/2016/01/xhw09.jpg)](assets/uploads/2016/01/xhw09.jpg)

Ha megpingeljük ismét az url-t, akkor ismét a múkodik szöveg jelenik meg. Ez eddig tök jó, de jelen pillanatban csak a saját beégetett route-unk által működik a dolog, ez pedig nem az igazi, mert ezt nekünk kézzel kellett felvegyük. Akkor jöjjön a hozzá tartozó route. Ezt szintén a boot-ban tudjuk megtenni. A laravel doksi azt mondja ki, hogy mindezt a csomagban található route-ok include-olásával oldjuk meg, viszont ez lekorlátozza a testreszabhatóságot, mert ha mi nem a /admin/login-al akarunk belépni, hanem /<del>lófasz</del>rucsok/login-al, akkor a vendor könyvtárba kellene nyúlni, ami - lássuk be -, nem szép.

Publisholjuk így hát ezt is és húzzuk be a fájlt a boot metódusban:

```
$this->publishes([
    __DIR__.'/../stub/routes.php' => base_path('app/Http/admin-routes.php'),
]); // a route-jainkat ide publisholjuk

if (file_exists(base_path("app/Http/admin-routes.php"))) { // ha már publisholtuk, húzza be, ez fontos, mert a boot mindig lefut, nem csak publish alkalmával
    require base_path("app/Http/admin-routes.php"); 
} // lehetne else ágban behúzni vendorból is, de lévén ezek a route-ok a már publisholt controllerekre mutatnak, így értelmetlen
```

Másoljuk a routes.php tartalmát át a vendorban megadott helyre és az eredeti tartalmát töröljük. Nyomjunk egy publish-t és nézzük meg mi történik..

Múko... ReflectionException. He?

A helyzet az, hogy a boot metódusban meghívott route-oknál a fully qualified classname-el tudunk hivatkozni a controllerekre, így az Admin\\AdminController nem elég:

```
Route::get('/admin', 'App\Http\Controllers\Admin\AdminController@index');
```

De ugye emlékszünk még a route groupokra? Felvesszük a route-jainkat egy csoportba, és prefixáljuk őket a megfelelő névtérrel:

```
Route::group(["namespace" => 'App\Http\Controllers'], function() {

    Route::get('/admin', 'Admin\AdminController@index');

});
```

#### Következő lépcső: view fájlok.

Ahhoz, hogy csomagunkban lévő view fájlokat elérjük, be kell őket regisztrálnunk, szintén a boot metódusban:

```
 $this->loadViewsFrom(__DIR__.'/../views', 'lara-admin'); // az első paraméter az elérési út, a második pedig a csomagnév, amivel regisztráljuk

 $this->publishes([
 __DIR__.'/../views' => base_path('/resources/views/vendor/lara-admin'), // a vendor publish-ra ide fogjuk őket publisholni
 ]);
```

Akkor nézzük hogy is fogja nekünk resolve-olni az adott view-kat a laravel. Amikor csomagból húzunk be view-t, akkor arra a csomag-neve::view-neve szintaxissal tudunk hivatkozni, tehát esetünkben, ha csinálunk egy index.blade.php-t a csomagunk views mappájába, akkor arra a lara-admin::index névvel tudunk hivatkozni. Amikor így húzzuk be, akkor a laravel először megnézi a projektünk views/vendor/csomag-neve mappában, hátha talál ilyet. Ez azt jelenti, hogy overrideoltuk az eredeti view fájlt, így azt használja. Ha nem, akkor jön a fallback, behúzza a csomagban lévőt. Próbáljuk ki!

A továbbörökített controllerünkben ne statikus szöveget, hanem view-t adjunk vissza:

```
// vendor/letscode/lara-admin/src/Controllers/AdminController.php

public function index() {
    return view("lara-admin::index");
}
```

Ha ez megvan, hozzunk létre egy index.blade.php-t, ugyanitt a views mappában:

```
Múkodik view-al is!
```

Ezután hívjuk böngészőben nézzük meg mi is a helyzet. Ha a csillagok ismét csoportselfie-znek, akkor a fenti szöveg jelenik meg a böngészőben. Ezután nyomjunk egy publish-t és az újonnan létrejött /resources/views/vendor/lara-admin mappában lévő index.blade.php-t írjuk át:

```
Mona Lisa Overdrive!
```

Ha lefrissítjük a böngészőt, akkor bang! a fenti szövegre módosult, tehát felülbíráltuk az eredeti view fájlokat!

#### CSS meg amit akartok!

A public mappába nem lesz nagy bonyodalom megoldani mindezt, itt szimplán publish-ra van szükségünk:

```
$this->publishes([
    __DIR__.'/../assets' => base_path('public/assets'),
]);
```

Persze ahhoz, hogy ezeket behúzzuk már kellene valami értelmesebb HTML szerkezet, nem?

Hozzunk létre akkor egy layout.blade.php-t a csomagunk views mappájában:

```

<html lang="hu">
<head>
    <meta charset="UTF-8">
    <title>Teszt</title>
    <link rel="stylesheet" href="assets/css/style.css" media="screen" />
    <script type="text/javascript" src="assets/js/site.js"></script>
</head>
<body>
@yield('content')
</body>
</html>
```

Majd módosítsuk az index.blade.php-t:

```
@extends("lara-admin::layout")

@section("content")
    Múkodik view-al is!
@endsection
```

Jól látható, hogy a blade templateknél is a lara-admin előtaggal hivatkoztunk rá. Akkor ahogy a layoutban megadtuk, hozzunk létre a csomagunk assets mappájában egy css és egy js mappát, style.css és site.js tartalommal. Egyelőre lehetnek üresek is, hiszen úgyis 404-et kapunk, ha valami balul sült el.

[![Az adományok jó kezekbe kerülnek :)](assets/uploads/2016/01/razer-blade-stealth-04.jpg)](assets/uploads/2016/01/razer-blade-stealth-04.jpg)

Majd nyomjunk egy publish-t. Ha mindent jól csináltunk, akkor hibák nélkül lefut, valamint az oldalra bökve nem kapunk 404-et a js és css fájlhivatkozásainkra se.

A következő részben elkezdjük írni a konkrét adminunkat, hogy valami tutiságot is belevegyünk!

</body></html>
