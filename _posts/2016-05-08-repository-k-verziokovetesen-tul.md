---
id: 1120
title: 'Repository-k a verziókövetésen is túl'
date: '2016-05-08T11:09:02+02:00'
author: tacsiazuma
layout: post
guid: '{{ site.url }}/?p=1120'
permalink: /2016/05/08/repository-k-verziokovetesen-tul/
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
image: 'assets/uploads/2016/04/09202126/recycling_iStock_000019128774XSmall-2.jpg'
categories:
    - 'Design Pattern'
    - PHP
tags:
    - datasource
    - implementation
    - mongo
    - pattern
    - repository
    - sql
---

Amikor az ember kódolásba kezd, akkor gyakorta törekszik arra, hogy a kódja egyes részeit újra tudja hasznosítani, hogy azok modulárisak

legyenek, át tudjuk vinni őket A projektből B projektbe, anélkül, hogy <del>reflectionnel megerőszakolnánk az egészet</del> fejfájást okoznánk magunknak vagy másoknak és ugyanolyan könnyedén használható maradjon mindez, mint az A projekt esetében.

Azonban mi a helyzet, ha pl. különböző adatforrások között szeretnénk váltani?[![IC340233](assets/uploads/2016/04/IC340233.png)](assets/uploads/2016/04/IC340233.png)

Tegyük fel, hogy rájöttünk, hogy a mi esetünkben a projekt állandó, ellenben A adatforrást ki szeretnénk söpörni és B adatforrást betenni a helyére? Nem gyakori eset, főleg azoknál, akik microsite-okra élezték ki magukat, azonban amikor egy applikáció befut és szóba jön a skálázhatóság, akkor bizony előferdülhet, hogy rájövünk, hogy erre az architektúrára, stb. már nem az igazi az eredeti elgondolás.

Na most itt jön elő az a gond, hogy sok esetben nem feltételezzük azt, hogy az adatforrásunk mobilis lenne, hanem azt autentikusan belebetonozzuk a kódunkba. Ha nem is közvetlenül, de közvetett módon mindenképp. Ha pedig ezt megtettük, akkor az a tesztelhetőség rovására is megy.

Ebben az esetben tud segítségünkre lenni a Repository pattern, ami egy hidat képez az alkalmazásunk kódja és az adatbázis réteg között.

Az előző cikkemben már szó volt hasonlóról, de akkor jöjjön ismét:

A lényeg, hogy a kliens, aki használja ezt a repository-t, nem kell tudnia honnan is jön az adat. Nem kell tudnia arról, hogy ő most Oracle adatbázissal vagy épp Solr-el dolgozik. Annyit kell tudnia, hogy az osztálypéldány, amit kapott implementál egy bizonyos interfészt.

Tehát az első lépés itt is, mint a legtöbb esetben, mikor megfordul a fejünkben az újrahasznosítás: **interface**

[![recycling_iStock_000019128774XSmall (2)](assets/uploads/2016/04/recycling_iStock_000019128774XSmall-2.jpg)](assets/uploads/2016/04/recycling_iStock_000019128774XSmall-2.jpg)

```
<pre data-language="php">interface PostRepository { // a nevezéktanról megoszlanak
        public function getForMainPage(); // egyelőre csak egy metódussal mutatom meg
}
```

Na most, hogy megvan mi is lesz az interfész, amit implementálhatunk, csináljunk egy egyszerű megvalósítást pl. Eloquent-el:

```
<pre data-language="php">class SqlPostRepository implements PostRepository {

       private $model;

       public function __construct(Post $model) { // átadunk neki egy querybuilder-t
             $this->model = $model;
       } 

       public function getForMainPage() {
             // kikérjük a 20 legújabb publikált bejegyzést és azt visszaadjuk egy collection-ben
             return $this->model->where("post_status", "publish")->orderBy("post_date", -1)->take(20)->get();
       }
}
```

Na most nézzük meg a mongoDb-s verziót és utána majd beszélünk arról, hogy ez miért is nem jó még így ebben a formában:

```
<pre data-language="php">class MongoPostRepository implements PostRepository {

       private $collection;

       public function __construct(MongoCollection $collection) { // átadunk neki egy collection-t
             $this->collection = $collection;
       } 

       public function getForMainPage() {
             // kikérjük a 20 legújabb publikált bejegyzést és azt visszaadjuk egy collection-ben
             return $this->collection->find(["post_status" => "publish"])->orderBy("post_date", -1)->limit(20);
       }
}
```

Mint azt már a múltkor is mondtam, jóllehet a nyelv nem statikusan típusos, de a visszatérési értékek fontosak. Ennélfogva ne csak a bemenő paraméterekre, hanem a visszatérési értékre is ügyeljünk! Ha ez collection objektummal tér vissza, akkor a másikban is az kell. Ha simán Traversable, akkor az, valamint a benne levő elemek típusa is fontos. Az Eloquent esetében kissé bajban vagyunk, mert a model objektumok tulajdonképpen active record-ok, ennélfogva kiírthatatlanul benne van az adatbázis kapcsolat, de erről írtam egy [korábbi]({{ site.url }}/2015/10/13/martin-papa-szinrelep-az-adataink/) cikkemben. A cél az lenne, hogy a kliensünk ne is tudja, hogy aktív rekorddal van dolga és ne próbálja a kontroller kellős közepén ráhívni a save()-et.

Ezt úgy tudjuk megoldani, hogy <del>valami másnak annotáljuk a return value-t és átverjük az IDE-t</del> a domain logikát kiemeljük az aktív rekordos osztályunkból és sima domain entity-ket adunk vissza/fogadunk el (persze nem kötelező). Úgy képzeljük el, hogy létrehozunk egy oda-vissza hidrátort, amivel az active record-os Post-ból domain entity Post lesz (és vissza), amivel a metódusain keresztül tudunk dolgozni. Ha pedig el akarjuk azt menteni, akkor átadjuk a repository-nak, ami ezt visszaalakítja és elmenti. Macerás, mi? 🙂

Először akkor hozzunk létre egy osztályt amin keresztül megvalósítjuk a business logic-ot.

> Mielőtt bárki a haját tépné, hogy az Eloquent legnagyobb előnyét eldobjuk, a példák alapvetően nem az active record megvalósításra összpontosítanak. Ha csak a tesztelhetőség a cél, amit szintén elősegít a repository, akkor dolgozhatunk végig aktív rekordos példányokkal.

```
<pre data-language="php">class PostEntity {

    private $title, $content, $excerpt, $date, $modified; // pár field-et felveszünk

    // ezekhez csinálunk gettert/settert.. ugye? :)

    // nem visszük túlzásba a "business logic"-ot
    public function setContent($content) {
         $this->content = $content; // beállítjuk a bejegyzésünk tartalmát
         if ($this->excerpt == "") {  // ha a kivonat üres, 
             $this->excerpt = substr($content, 0, 60);  // akkor defaultként megkapja az első 60 karaktert
         }
    }

}
```

Nos akkor azzal már megvagyunk, hogy mit is adjon vissza a repository és mi mit adjunk neki, de akkor kell valami ami átalakítja. Ez a repository lesz. Jöhet a kérdés, miszerint miért nem csinálunk valami statikus metódust, amin át hydrálhatjuk az adatokat mint a Zendben pl. Szerintem a válasz magától értetődő, ugyanis nem a termékek fognak belepottyanni a kosarunkba a boltban sem, hanem mi tesszük bele azokat.

[![hydrate](assets/uploads/2016/05/hydrate-300x227.jpg)](assets/uploads/2016/05/hydrate.jpg)

Az objektumunk feladata hogy tárolja az állapotát és lehetőséget biztosítson annak megváltoztatására, de nem kell átalakulnia 🙂

Akkor jöjjön az sql repository-s megvalósítás:

```
<pre data-language="php">...
 public function getForMainPage() {
             // kikérjük a 20 legújabb publikált bejegyzést és azt visszaadjuk egy collection-ben a hydrator metódusnak
             return 
                      $this->hydrateCollection(
              $this->model->where("post_status", "publish")->orderBy("post_date", -1)->take(20)->get()                       );
       }
   // lévén ez privát, ezért az interfészben nem fog szerepelni, adatforrás függő a megvalósítása
 private function hydrateCollection(Collection $objects) {
             return $objects->map([$this, 'hydrateObject']); // az egyes elemeket átadjuk a hydrateObjectnek és a visszatérési értékekből is collectiont csinálunk
       }

 private function hydrateObject(Post $object) {
             // itt használhatunk prototype-ot is
             $entity = new PostEntity();
             $entity->setTitle($object->title);
             // beállítgatjuk a változókat settereken át
             return $entity;  // majd visszaadjuk azt
       }
```

Amikor business entity-t adunk át a repository-nak, akkor pedig azt alakítjuk vissza. De nézzük a mongoDB-s megvalósítást, mert ott inkább jellemző ez a fajta megközelítés:

```
<pre data-language="php">public function getForMainPage() {
             // kikérjük a 20 legújabb publikált bejegyzést és azt visszaadjuk egy collection-ben
             return $this->hydrateCollection(
                $this->collection->find(["post_status" => "publish"])->orderBy("post_date", -1)->limit(20));
       }

// lévén ez privát, ezért az interfészben nem fog szerepelni, adatforrás függő a megvalósítása
 private function hydrateCollection(Traversable $objects) {
             return Collection::make($objects)->map([$this, 'hydrateObject']); // collection-t csinálunk a kapott iterátorból,
az egyes elemeket átadjuk a hydrateObjectnek és a visszatérési értékeket átmappeljük
       }

 private function hydrateObject(array $document) { // a document tömbként érkezik
             // itt használhatunk prototype-ot is
             $entity = new PostEntity();
             $entity->setTitle($document["title"]);
             // beállítgatjuk a változókat settereken át
             return $entity;  // majd visszaadjuk azt
       }
```

Na most, hogy kész van a kétféle megvalósítás, akkor nézzük meg hogy is lehet ezt ügyesen cserélgetni!

```
<pre data-language="php">class PostController extends Controller {

          private $postRepository;

          public function __construct(PostRepository $repository) { // interfészt hintelünk, ennélfogva a megvalósítás szabad
                 $this->postRepository = $repository;
          }

          public function index() { // a '/'-re van mappelve
                return view('index')->with('posts', $this->postRepository->getForMainPage()); 
                // az interfészben fel van véve, ezért az IDE se nyavalyog
          }
}
```

A fenti példa egy laraveles controller, ami kontrollereket, mint tudjuk az ún. Service Containeren át példányosít a laravel. Tudom, még nem írtam a Laravel IoC containerről, de ez most csak egy aprócska szeglete lesz. A lényege annyi, hogy csúnya reflectionnel kiszedi a typehinteket a konstruktorból és metódusokból és próbálja megtalálni az oda illő service-t és azt átadva meghívni. Na most ha olyan osztályokat adunk meg, amiknek a konstruktora üres, akkor simán példányosítja azt és beilleszti. Ezzel nincs is probléma, viszont mi most interfészt adtunk meg, ami nem példányosítható. Ilyenkor jön az, hogy <del>akkora exceptiont dob, mint ide mátészalka</del> segítenünk kell az IoC containernek eldönteni, hogy az adott interfész melyik implementációja is kell itt. Ehhez az AppServiceProvider osztályban kell kicsit piszkálódnunk:

```
<pre data-language="php">/**
 * Register any application services.
 *
 * @return void
 */
public function register()
{
    $this->app->bind('\App\Repositories\PostRepository', '\App\Repositories\SqlPostRepository');
    // hozzákötjük a PostRepository interfészt az Sql-es megvalósításhoz, így azt példányosítja majd ha az interfészt
    // typehinteljük
}
```

Ha le akarjuk cserélni a háttérben a megvalósítást, és azzal az adatforrást, akkor mostmár csak 1 sort kell átírnunk és bumm.. Reflection black magic! Mivel ugyanazokat az objektumokat adjuk vissza a repository-ból és ugyanazt is várjuk vissza, ezért a kliens kódjában semmit nem kell írni, mindent megtesz a repository a háttérben. Remélem a cikk segített egy kis betekintést nyerni, hogy is lehet alkalmazni a Repository patternt a gyakorlatban és mi is az értelme a dolognak.