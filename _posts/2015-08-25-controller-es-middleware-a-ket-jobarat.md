---
id: 722
title: 'Controller és middleware a két jóbarát'
date: '2015-08-25T10:20:55+02:00'
author: tacsiazuma
layout: post
guid: '{{ site.url }}/?p=722'
permalink: /2015/08/25/controller-es-middleware-a-ket-jobarat/
dsq_thread_id:
    - '4064740957'
    - '4064740957'
categories:
    - Backend
    - Intermediate
    - Laravel
tags:
    - after
    - before
    - controller
    - kernel
    - laravel
    - middleware
    - route
    - terminable
---

Most, hogy a [routingot ]({{ site.url }}/2015/08/17/nyelvtani-alapok-lara-val-laravel/)tisztába tettük, nézzünk egy kicsit bele abba, hogy azokat a route-okat, amiket belőttünk miféle controllerekbe tudjuk belevezetni? Hiszen nem gondolhatjuk komolyan, hogy a kérések kezelésének logikáját a routes.php-ban írjuk meg, nemde? Főleg, hogy az MVC-ben ez lenne a controllerek dolga. Ezek általánosan az app/Http/Controllers mappába kerülnek.[![Xbox-360-S-Controller](assets/uploads/2015/08/Xbox-360-S-Controller-1024x839.png)](assets/uploads/2015/08/Xbox-360-S-Controller.png)

> **Megjegyzés:** Minden controllernek extendelnie kell a Controller osztályt.

Nézzünk egy egyszerű példát:

```
<?php // /app/Http/Controllers/MockController.php követjük a PSR standardot

namespace App\Http\Controllers;

class MockController extends Controller { 

   public function index() { // minden meghívott metódusnak publikusnak kell lennie, hogy a dispatcher elérje azt.
      return view(); // a template fájlokat itt adjuk vissza
   }

}
```

Na most akkor nézzük, hogy is tudunk hivatkozni erre a controller/action párosra (egy kis ismétlés gyanánt):

```
Route::get("/", [
    "uses" => "MockController@index",  // itt adhatjuk meg a controller/action párost
    "as" => "home" // itt pedig a route nevét, ami néven később tudunk rá hivatkozni
]);

route("home") // az előző route-hoz tartozó URL-t adja vissza
// blade templateben ugyanez: {{ route("home") }}
```

#### Implicit routing[![parental-advisory-explicit-lyrics-C](assets/uploads/2015/08/parental-advisory-explicit-lyrics-C-1024x768.jpg)](assets/uploads/2015/08/parental-advisory-explicit-lyrics-C.jpg)

Igazából most jövök rá, hogy pár dolog kimaradt a routing szekcióból, de most pótlom őket. Nos, kicsit fárasztó lenne minden egyes metódust lemappelni, nemde? Emiatt laravelben lehetőségünk van arra, hogy csak a controllert adjuk meg a route-hoz, míg a metódusok nevét a Laravel összekapcsolja nekünk.

```
Route::controller("/posts", "PostController", [ // csak az URL tagot és a controller nevét adjuk meg. 
"getIndex" => "home"] ); // itt is lehetőségünk van az egyes mappelt metódusokhoz nevet rendelni, amit később az URL helperrel használhatunk

// a GET /posts/index url a PostController@getIndex-re mutat
// a POST /posts/test-view a PostController@postTestView-ra mutat. Ez az ún. dash-syntax. A kötőjelet követő betű nagybetűvé lesz alakítva és a kötőjel ki lesz purgálva a névből.

```

Ha olyan metódust írunk be, amihez tartozó metódus nem létezik, akkor 404-es oldalra leszünk irányítva.

Middleware-ek definiálás a kontrollerben is lehetséges:

```
public function __construct() {
  $this->middleware("auth"); // a konstruktorban helyezzük mindezt el, és a sorrend számít
  $this->middleware("log", array("only" => "getIndex")); // beállíthatjuk, hogy csak bizonyos metódusokra legyen érvényes
  $this->middleware("mock" array("except" => "getIndex")); // vagy épp azt, hogy melyekre ne
}
```

Pihentessük a szemünket!

Laravelben lehetőségünk van arra, hogy ún. RESTful controller route-okat definiáljunk.

```
Route::resource("photo", "PhotoController");
```

Ahhoz, hogy egy ilyen controllert létrehozzunk, a következőt kell bepötyögni a laravel rootjában állva:

```
php artisan make:controller PhotoController
```

Ez legenerálja nekünk a controllert, valamint a hozzá tartozó action-öket, persze üresen. Ezeket az action-öket az alábbiak szerint mappeli nekünk ez a route beállítás:

|---|
|-----|
|  | GET |  | /photo |  | index |  | photo.index |  |
|  | GET |  | /photo/create |  | create |  | photo.create |  |
|  | POST |  | /photo |  | store |  | photo.store |  |
|  | GET |  | /photo/{photo} |  | show |  | photo.show |  |
|  | GET |  | /photo/{photo}/edit |  | edit |  | photo.edit |  |
|  | PUT/PATCH |  | /photo/{photo} |  | update |  | photo.update |  |
|  | DELETE |  | /photo/{photo} |  | destroy |  | photo.destroy |  |

Persze itt is lehetőségünk nyílik korlátozni, hogy mely action-öket szeretnénk a route-on meghagyni/vagy épp kizárni:

```
Route::resource("photo", array("only" => array("index", "show")));

```

```
Route::resource('photo', 'PhotoController',
 ['except' => ['create', 'store', 'update', 'destroy']]);
```

Lehetőségünk van továbbá egymásba ágyazni ezeket a Resource route-okat. Csupán az ún. dot notation-t kell használni, vagyis pontokkal válasszuk el egymástól őket:

```
Route::resource("photos.comments","PhotoCommentController");
```

Az ilyen módon regisztrált route-okat így tudjuk elérni: photos/{photos}/comments/{comments}, és a paramétereket hasonlóképpen kapják meg:

```
class PhotoCommentController extends Controller {
```

```
 /**
 * Show the specified photo comment.
 *
 * @param int $photoId
 * @param int $commentId
 * @return Response
 */
     public function show($photoId, $commentId)
     {
       //
     }
}
```

A fenti példában látszik, hogy a két szükséges ID-t megkapjuk paraméterben.

Ha más route-okat is szeretnénk definiálni a Resource controller alapértelmezettjei felül akkor azokat a Route::resource definiálása előtt tegyük meg:

```
Route::get('photos/popular', 'PhotoController@method'); // csináltunk egy újabb endpointot
Route::resource('photos', 'PhotoController'); // valamint az alap resource route-okat is fellőttük
```

Az előző cikkben már használtunk Dependency Injection-t az egyik metódusunknál, ahol egy model osztályt vártunk paraméterként. Ugyanezt megtehetjük a konstruktorunk esetében is. A controllerek kiszolgálását a laravelben az ún. service container végzi, amit egy későbbi cikkben kitárgyalunk. Ilyen formában Modeleket, Request objektumot és még sok mást átadhatunk paraméterként a konstruktornak vagy épp az adott actionnek.

#### Middleware

A Laravelben a Middleware-ek szolgálnak egyfajta pre-dispatch hooknak, vagyis mielőtt a controllerhez érne egy adott request, előtte ezeken az ún. Middleware-eken át megszűrjük azt. Ilyen middleware az authentikációért felelős, ami továbbenged, ha be vagyunk jelentkezve, vagy épp redirektál egy loginoldalra. Számos ilyet csomagoltak a keretrendszerrel, amik egyből működésre készek. Ezek az osztályok az app/Http/Middleware könyvtárban csücsülnek.

Na de mégis mibe fáj egy ilyet létrehozni?

Ahogy a legtöbb dologban a laravelnél, két út létezik, az egyik a kényelmes megoldás, ami csupán annyi, hogy kiadjuk a következő parancsot:

```
php artisan make:middleware [middleware-neve]
```

a másik pedig <del>olyan, mintha sajtreszelővel \*\*\*\*nánk</del> amikor kézzel belekulákoljuk a könyvtárba az osztályt

```
<?php
namespace App\Http\Middleware;

class LimitBeer {
    public function handle($request, \Closure $next) { // ezeket a paramétereket kapjuk meg, ezt a sémát követnie kell 
        
        if ($request->input("beer") == 1) { // ha a bejövő paraméterek közül a beer értéke = 1, akkor redirektáljuk a kérést.
            return redirect("egySorAzNemSor");
        }        
        return $next($request); // továbbadjuk a $request objektumot a következő middleware-nek vagy a controllernek
    } 
}
```

és a Kernel.php-ben is bevezetjük azt, hogy tudjunk rá aliassal hivatkozni:

```
protected $routeMiddleware = [
    'limit' => \App\Http\Middleware\LimitBeer::class,
];
```

Ha ez utóbbit nem tesszük meg, akkor a fully qualified classsname-el tudunk rá hivatkozni, úgy is felismeri a rendszer.

A middleware-ek futhatnak a request feldolgozása előtt, vagy éppen utána. Ez csak attól függ, hogy is hoztuk őket létre:

```
<?php namespace App\Http\Middleware;

use Closure;

class BeforeMiddleware implements Middleware {

    public function handle($request, Closure $next)
    {
        // Perform action

        return $next($request); // az előzőekben már látott formában továbbadjuk a request-et a következő felelősnek
    }
}
```

A fenti módszer ugyanolyan, mint amit legelőször bemutattam, jön a request, moleszteráljuk egy keveset és továbbadjuk azt. Azonban ha a request feldolgozása után szeretnénk valamit, akkor azt a következő módon tudjuk elvégezni:

```
<?php namespace App\Http\Middleware;

use Closure;

class AfterMiddleware implements Middleware {

    public function handle($request, Closure $next)
    {
        $response = $next($request); // itt továbbadjuk a következőnek, az megint a következőnek és így tovább, míg végül a controller is megkapja és a végső feldolgozott állapotot kapjuk vissza, így a Response objektum áll rendelkezésünkre.
 
        // Perform action

        return $response; // majd a választ dobjuk tovább
    }
}
```

Ha a middleware-jeinket szeretnénk MINDEN route esetében használni, akkor lehetőség nyílik ún. globális middleware-ek definiálására is, szintén a Kernel osztályban:

```
protected $middleware = [ // ez a tömb szolgál a globális middleware-ek részére
    \App\Http\Middleware\LimitBeer::class, // itt nem kell megadni aliast, mert nem hívhatók meg direktben, maguktól futnak le
];
```

#### Terminable Middleware

Vannak esetek, mikor a HTTP response kiküldése után szeretnénk még valamit ügyködni. A "session" middleware, ami a laravellel érkezik pont ezt csinálja, a session adatokat írja be a storage-be, miután ki lett küldve a response. Ahhoz, hogy ezt a feladatot ellássuk, ún. "terminable" middlewaret kell létrehozzunk:

```
<?php 
use Closure;
use Illuminate\Contracts\Routing\TerminableMiddleware;

class StartSession implements TerminableMiddleware {

    public function handle($request, Closure $next)
    {
        return $next($request); // ugyanúgy működik, ahogy a többi before middleware
    }
// itt már implementálnunk kell a terminate metódust is
    public function terminate($request, $response) // megkapjuk a request és a response objektumot egyaránt
    {   
        // Store the session data...
    }

}
```

Ahogy a példán is látszik, itt már nem elég a handle metódust implementáljuk, a terminate metódust is kell, amiben megkapjuk a request és response objektumokat is, hogy azokkal operáljunk. Ezeket a middleware-eket a globális middleware-ek között kell regisztrálnunk a Kernel osztályunkban.

A controllerekről és middleware-ekről ennyit, legközelebb a request és response osztályoknak nézünk a körmére!
