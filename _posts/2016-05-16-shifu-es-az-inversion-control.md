---
id: 1134
title: 'Az oktrojátor pattern és az IoC container'
date: '2016-05-16T13:43:16+02:00'
author: tacsiazuma
layout: post
guid: '{{ site.url }}/?p=1134'
permalink: /2016/05/16/shifu-es-az-inversion-control/
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
newsphere-meta-content-alignment:
    - align-content-left
image: 'assets/uploads/2016/05/09202130/145cs1.jpg'
categories:
    - 'Design Pattern'
    - Laravel
tags:
    - container
    - dependency
    - ioc
    - laravel
    - provider
    - service
---

Az objektumorientált programnyelvekben értelemszerűen objektumokkal dolgozunk. Apróbb programok esetén, mikor nem használunk erre kitalált keretrendszert, az objektumpéldányaink menedzselése ránkmarad. Ahhoz, hogy a kódunk moduláris és tesztelhető legyen, az objektumaink függőségeit be kell "oktrojáljuk" a egymásba. Akinek a dependency injection nem tiszta, annak [itt ]({{ site.url }}/2015/01/21/oops-avagy-dependency-injection-praktikak/)ez a cikk, mert szükség lesz rá a későbbiekben. Ez az egymásba pakolászás egy idő után eléggé komplex lehet, ezért egyes keretrendszerek, így a Laravel vagy Java nyelvben a Spring erre a célra rendelkezik egy ún. IoC containerrel. Ezekről lesz a cikkben szó.[![145cs1](assets/uploads/2016/05/145cs1.jpg)](assets/uploads/2016/05/145cs1.jpg)

Aki szerint nem állhat elő olyan helyzet, hogy a függőségek menedzselése macera, annak mutatnám az alábbi példát:

Van egy Repository osztályunk, aminek függősége egy Eloquent builder, ami buildernek van egy connection-je, amit egy connectionresolver-en keresztül kapott meg, ami resolver a .env fájl alapján lett felkonfigurálva. Ezen felül lesz még egy cache is, aminek a típusa szintén a .env fájlból jön és így tovább...

Ja igen, és ezt a repository-t be kellene injektálni már a kontrollerbe is, ami kontrollernek szintén vannak még más rendszer által biztosított függőségei. Erre mondá az orákulum, hogy ["Jó étvágyat kívánok!"](https://youtu.be/sZ6cGZKgwbI?t=21)

#### Laravel IoC container

Laravel, ahogy több keretrendszer (nem csak PHP-ben) biztosít számunkra egy ún. service containert. Ez a container szolgál az egyes függőségeink tárolására. A konténerből többféle módon tudunk függőségeket előrántani, melyek közül jópárral már alapból felvértez a rendszer.

#### Typehint

Amikor egy objektumot a konténeren keresztül kapunk meg, akkor azt a rendszer előtte csodálatos reflectionnel feltérképezi és a hozzá szükséges függőségeket betölti. Az első ilyen objektum, amit a konténerből kapunk meg, az a controllerünk lesz. Ez lesz a leggyakoribb módszer, amit alkalmazunk. Nézzünk egy példát:

```
<pre data-language="php">class PostController extends Controller {
     public function index(PostRepository $postRepository) {
          return view('index')->with('posts', $postRepository->getForMainPage()); 
     }
}
```

A fenti példában, ha nem végeztünk semmiféle előzetes konfigurációt, akkor a container megpróbálja majd számunkra megkeresni a PostRepository osztályt (FQCN-re hivatkozva) és példányosítani azt. Nézzük most ezt a PostRepository osztályt!

```
<pre data-language="php">class PostRepository {
    
    private $model;

    public function __construct(Post $model) {
        $this->model = $model;
    }
    // metódusok
}
```

Hoppá, bajban lesz a container, mert ezt az osztályt nem lehet csak úgy példányosítani, ennek is megvan a maga függősége. De szerencsénkre a konténer, ahogy korábban volt szó róla, megkeresi a typehintelt függőségekhez tartozó osztályokat és beoktrojálja azt. Tehát helyettünk felgöngyölíti a függőségi fát és legjobb tudása szerint megpróbálja teljesíteni a kérésünket. How cool is that?

#### App, make

Persze nem csak így lehet a példányokhoz hozzájutni. Képzeljük el, hogy tesztelni szeretnénk a fenti repository-t, de nem kívánunk a tesztkódunkba hosszasan építgetni a függőségi fát. Szerencsénkre a TestCase osztályban elérjük az App instance-t, amin keresztül szintén le tudjuk kérni a fenti repository-t:

```
<pre data-language="php">/** @test */
public function how_cool_is_that() {
      $postRepository = $this->app->make('PostRepository'); // a make metódus fog kinyúlni a konténerbe érte
      $postRepository = $this->app['PostRepository']; // ugyanaz a hatás, más syntax
      // tesztkód
}
```

#### Bind

Természetesen a fenti példák rendkívül leegyszerűsítettek, mivel legtöbbször nem tudja a konténer kiszolgálni a kérésünket, vagy nem pont úgy, ahogy mi szeretnénk. Gondoljunk csak bele, ha példányosítás után szeretnénk pl. settereken át beállítani más függőségeket. Ahhoz, hogy be tudjunk regisztrálni egy service-t (vagy komponenst, az szebben hangzana), ahhoz a ServiceProvider osztályokban kell matatni. Legyen most ez az AppServiceProvider, ahol a $this->app változón át van referenciánk az applikációra:

```
<pre data-language="php">public function register() {
        // a PostRepository névre bekötjük a closure visszatérési értékét
        $this->app->bind('PostRepository', function($app) { // paraméterként megkapjuk az applikációt
              $repo = new PostRepository(); // példányosítjuk noarg konstruktorral
              $repo->setCache($app['SomeCache']); // egy másik objektumot kikérünk a konténerből és átadjuk paraméterként
              return $repo; // visszatérünk vele  
        });

}
```

> A fenti megvalósítás, minden alkalommal mikor kérünk egy példányt újból lefut, tehát factory-ként működik.

Természetesen szükségünk lehet singleton-okra is, egy loggert például nem akarunk 10 alkalommal példányosítani, ugye?:)

```
<pre data-language="php">$this->app->singleton('PostRepository', function($app) { // paraméterként megkapjuk az applikációt
              $repo = new PostRepository(); // példányosítjuk noarg konstruktorral
              $repo->setCache($app['SomeCache']); // egy másik objektumot kikérünk a konténerből és átadjuk paraméterként
              return $repo; // visszatérünk vele  
        });
```

A fenti példányt egyszer fogja csak létrehozni, majd becache-eli a konténerben és később azzal tér vissza, ha hívjuk. Természetesen megtehetjük azt is, hogy nem Closure-t, hanem már kész objektumot adunk át második paraméterként:

```
<pre data-language="php">        $this->app->singleton('PostRepository', $repo);
```

#### Interface -> Implementation

Na de mi van akkor, ha valaki igényesen írta a kódját és a typehintekben nem konkrét megvalósítások vannak, hanem interfészek? Nézzünk egy példát:

```
<pre data-language="php">class PostController extends Controller {
     public function index(IPostRepository $postRepository) { // interfészt typehintelünk
          return view('index')->with('posts', $postRepository->getForMainPage()); 
     }
}
```

Lévén interfészt nem lehet példányosítani, de a rendszer mégis megpróbálja, ezért csodás 500-as hibával elszáll a kód. Hogy tudjuk ezt kikerülni? Tegyük fel, hogy csináltunk háromféle megvalósítást:

```
<pre data-language="php">class SqlPostRepository implements IPostRepository { 
// megvalósítás 
}
class MongoPostRepository implements IPostRepository { 
// megvalósítás 
}
class SolrPostRepository implements IPostRepository { 
// megvalósítás 
}
```

Úgy, hogy az interfészt hozzákapcsoljuk a megvalósító osztályhoz:

```
<pre class=" language-php" data-language="php">$this->app->bind('IPostRepository', 'SqlPostRepository'); // az interfészt hozzákapcsoljuk sql adatbázis megvalósításhoz
$this->app->bind('IPostRepository', 'MongoPostRepository'); // mongohoz
$this->app->bind('IPostRepository', 'SolrPostRepository'); // vagy épp solrhez
```

Ezzel azt is megoldjuk, hogyha a megvalósító osztályok közt változtatni akarunk, akkor egyetlen egy sorban kell hozzányúlni a programhoz és bumm.

> Persze itt jönnek majd azok a kommentek, hogy "én bizony nem láttam még olyan alkalmazást, ami alatt ki kellett cserélni a datasource-t" 🙂

Ellenben itt előjön az újabb probléma, mert lehet, hogy ugyanazt az interfészt több helyen is typehinteltük. Ez addig nem is jelent gondot, amíg mindenhol ugyanazt a megvalósítást akarjuk rá használni. Viszont ha ez változik, akkor bajban lehet...nénk, ugyanis erre is van megoldás a Laravelben (lévén az alaprendszerben is előfordulhattak ilyenek és így muszáj volt megoldani ):

A kontextushoz tudjuk kötni a típust, amit az adott typehintre a konténer szolgáltat. Tehát megmondhatjuk, hogyha A interfészt látjuk, de a megvalósítás B, akkor ne a szokásos módon resolveolja, hanem adja ide a C-t.

```
<pre data-language="php">$this->app->when('App\Http\Controller\PostController') // ha a postcontrollerből kérjük, akkor
             ->needs('IPostRepository') // tekintsünk el a névterektről most
             ->give('SqlPostRepository'); // sql megvalósítást adunk
```

Eléggé pofonegyszerű a dolog, nem is taglalnám jobban ezt a részét.

A konténerünk amikor felold egy függőséget, akkor meghív egy eseményt, amire mi szépen felcsücsülhetünk és bele tudunk szólni az esemény példányosításába. Ez alapvetően nem tűnik nagy cuccnak, de vegyük a következő példát:

Van egy tanfolyamokkal foglalkozó oldalunk, ahol online lehet az egyes tanfolyamokra jelentkezni. Erről kap értesítést a felhasználó, az admin, valamint az adatbázisba is bekerül, értelemszerűen. A service, ami összefogja ezt a jelentkezés dolgot, legyen pl. az CourseService facade, amiben lekódoltuk az összes lépést. Ez, lévén függősége a mailer, az adatbázis, valamint az aktuális CourseOrder, a konténeren keresztül kérjük le:

```
<pre data-language="php">// jöjjék hát a betonszimpla kontroller:
class CourseController extends Controller {

     public function order(CourseService $service, CourseOrder $order) { 
          // a service szimplán példányosítva van, az ordert pedig felvettük a providerben
          try {
              $service->doMagic($order); // megkérjük a service-t, hogy végezze el a mágiát helyettünk
          } catch (Exception $e) {
              return view('done')->with('error', 'There was a disturbance in the Force'); // zavar támadt az erőben       
          }
          return view('done'); // minden klappul ment 
     }
}
```

Na most, hogy is lesz ott nekünk az a CourseOrder példányunk? Korábban már volt róla szó, hogy a providerben fel tudjuk ezt venni:

```
<pre data-language="php">$this->app->bind('CourseOrder', function($app) {
      return CourseOrder::hydrateFromRequest($app['\Illuminate\Http\Request']); 
      // kikérjük a http requestet és abból szűrjük át a változókat az orderbe
});
```

A Service-ünk doMagicje alább néz ki:

```
<pre data-language="php">class CourseService {

    private $logger;
 
    public function setLogger(Logger $logger) {
         $this->logger = $logger;
    }

    // a konstruktorba képzeljük oda a sok függőséget
    public function doMagic(CourseOrder $order) {
         if ($this->logger != null) {
            $this->logger->debug($order->__toString()); // a toString-et overrideoltuk, így valami shiny logot tudunk belőle
         }
         $this->courseRepository->applyToCourse($order);
         $this->mailer->sendAdminNotification($order);
         $this->mailer->sendNotification($order);
    }

}
```

Tök jól megy a bolt, jelentkeznek az emberek, de egyszer csak jelzi az ügyfél, hogy valami gixer van, ugyanis esetenként rossz értékek kerülnek kiküldésre/az adatbázisba. A tanfolyamok típusa keveredik, ezért mielőtt több ilyen történik, bekapcsoljuk a logolást, hogy lássuk mi a stájsz.

Lévén a konstruktorban nem szerepel a logger, így alapból nem hízlaljuk a fájlokat, mert a log üres. De most szeretnénk azt bekapcsolni és lehetőleg egyszerűen.

Ha a facade-ünket simán resolveolja a konténer, akkor mi nem szeretnénk beleavatkozni a dologba, ellenben mielőtt azt megkapjuk máshol, szeretnénk a loggert hozzáadni. Ezt úgy tudjuk megcsinálni, hogy feliratkozunk a resolve eseményére:

```
<pre data-language="php">$this->app->resolving(function(CourseService $serv, $app) {
     $serv->setLogger($app->make('Logger')); // az objektumhoz hozzáadjuk a loggert.
});
```

Ezáltal mikor a konténer kiszolgálja a fenti függőséget, előtte még hozzáadja a loggert. Így ha ezt később ki szeretnénk kapcsolni, csupán a providerből kell a fenti pár sort kitörölnünk.