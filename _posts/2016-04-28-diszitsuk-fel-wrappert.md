---
id: 1108
title: 'Díszítsük fel a wrappert!'
date: '2016-04-28T20:29:05+02:00'
author: tacsiazuma
layout: post
guid: '{{ site.url }}/?p=1108'
permalink: /2016/04/28/diszitsuk-fel-wrappert/
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
image: 'assets/uploads/2016/04/09202119/ZB0307H_grilled-chicken-caesar-wrap_s4x3.jpg'
categories:
    - 'Design Pattern'
    - PHP
tags:
    - decorator
    - design
    - pattern
    - php
    - wrapper
---

A decorator pattern a struktúrális minták közé tartozik, és a célja roppant egyszerű: magába foglal egy másik osztályt és plusz funkcionalitással látja el azt, így az eredeti osztály metódusai érintetlenek maradnak. Nézzük meg hogy is történik mindez!

<figure aria-describedby="caption-attachment-1109" class="wp-caption aligncenter" id="attachment_1109" style="width: 365px">[![Forrás: foodnetwork.com](assets/uploads/2016/04/ZB0307H_grilled-chicken-caesar-wrap_s4x3-1024x768.jpg)](assets/uploads/2016/04/ZB0307H_grilled-chicken-caesar-wrap_s4x3.jpg)<figcaption class="wp-caption-text" id="caption-attachment-1109">Forrás: foodnetwork.com</figcaption></figure>

Az első kérdés, ami a fentiek láttán felmerülhet az olvasókban, hogy:

> Nem erre van az öröklődés?

A válasz igen, erre van az öröklődés, de a probléma az öröklődéssel az, hogy azt egyszer a kódban megcsináljuk és onnan kezdve az adott, nem változtathatunk rajta. Képzeljük el a következő helyzetet:

Szeretnénk futásidőben plusz funkcionalitással felvértezni pl. egy repository-t. Legyen ez a funkcionalitás például a cache-elés. Ez ugye megoldható <del>az ördög művével, monadokkal</del> örökléssel. Viszont mi a helyzet akkor, ha több ilyen repository osztályunk van, az adatbázisunktól függően? Mindegyiket leörökítjük külön-külön? Vagy mi a helyzet akkor, ha hozzá szeretnénk adni még plusz logolást? Netán valami mást? Mindezt különböző kombinációkban? Ember legyen a talpán, aki megírja azt a CachingLoggingAndEventTriggeringSqlPostRepository-t, nem beszélve a CachingAndEventTriggeringSqlPostRepository-ról és a többi alfajról 🙂

Akkor nézzük hogy is lehet ezt szebben megoldani!

Először is szükségünk lesz egy <del>rücsök</del>interfészre:

```
interface PostRepository {
      public function getForMainPage();
      public function getPostById($id);
      public function getPostBySlug($slug);
      // egyelőre legyen elég ennyi
}
```

Na most hogy megvan az interfész, jöhet is a konkrét megvalósítás, hiszen konkrét adatforrásra szeretnénk illeszteni:

```
class SqlPostRepository implements PostRepository {
      
      public function getForMainPage() {
           // sima SQL cucc
           return $posts;
      }

      public function getPostById($id) {
           // sima SQL
           return $post;
      }

      public function getPostBySlug($slug) {
           // sima SQL
           return $post;
      }
}
```

Ez ugye az egyik megvalósítás, most akkor írjuk meg ugyanezt mongoDB-re is.

```
class MongoPostRepository implements PostRepository {
      
      public function getForMainPage() {
           // sima Mongo lekérés
           return $posts;
      }

      public function getPostById($id) {
           // sima Mongo
           return $post;
      }

      public function getPostBySlug($slug) {
           // sima Mongo
           return $post;
      }
}
```

Itt ugyan nem látszik, de **a visszatérési értékek is fontosak.** Még 1-2 hónap és PHP return syntax-ot is rá merem majd húzni a példákra, addigra már biztos nem ijed meg tőlük senki 🙂

Na most hogy megvan a kétféle megvalósítása interfészünknek, nézzük meg mi is történik akkor, ha szeretnénk cache-elni a kimenetet?

Először is csináljunk egy absztrakt osztályt a decorator-nak:

```
abstract class PostRepositoryDecorator implements PostRepository {

      protected $repository;

      public function __construct(PostRepository $repository) {
           // a magába foglalt repository-t várjuk konstruktorban
           $this->repository = $repository;
      }
      public function getForMainPage() {
           // továbbdobjuk a kérést
           return $this->repository->getForMainPage();
      }

      public function getPostById($id) {
           // továbbdobjuk a kérést
           return $this->repository->getPostById($id);
      }

      public function getPostBySlug($slug) {
           // továbbforwardoljuk a metódust
           return $this->repository->getPostBySlug($slug);
      }

}
```

Az abstract osztályunk még semmi mást nem csinál, csak annyit, hogy a repository-nak delegálja a kéréseket. Ez azért lesz nekünk jó, mert a megvalósításban nem kell azt is megírjuk, amit egyébként érintetlenül akarunk hagyni. Pl. egy post preview esetén nem akarunk semmit cache-elni, hiszen szerkesztés közben nézegetjük azt, ha becache-eljük, akkor nagyon imádni fognak a szerkesztők 🙂

Jöjjön akkor a konkrét megvalósítás:

```
class CachedPostRepository extends PostRepositoryDecorator {

      private $cache;

      public function __construct(PostRepository $repository, CacheInterface $cache) { // tekintsünk most el a cache milyenségétől
            $this->cache = $cache;
            parent::__construct($repository); // továbbdobjuk az absztakt konstruktorának
      }

      public function getForMainPage() { 
            if (!$this->cache->has('postsForMainPage')) { // ha nincs benne a cache-ben,
                $posts = $this->repository->getForMainPage(); // kikérjük a sima repository-ból
                $this->cache->put('postsForMainPage', $posts, 3600); // 1 órára betoljuk a cache-be
                return $posts; // majd visszaadjuk azt
            }   
            $this->cache->get('postsForMainPage'); // ha benne volt, akkor kiszolgáljuk innen
      }

      // a többi metódust érintetlenül hagyjuk, oda nem kell cache
}
```

Na most akkor mi is történt az imént? Példányosításkor várunk egy cache-t, valamint a repository-t. Ha a főoldalra kellenek a posztok, akkor azt lecache-eljük, a többihez nem nyúlunk, csak simán kiszolgáljuk az eredeti repository-ból. Miért is jó ez? Nem kell belenyúlni az eredeti osztályba, hogy plusz funkcionalitást kapjunk, az interfész ugyanaz, tehát ahol nem konkrét osztályt várnak (mert az nem szép dolog, ugye?) ott ezt az osztályt is átadhatjuk és a kliensünknek fogalma se lesz róla, hogy valami változott. De jöjjön a bónusz.. ezeket lehet egymásba csomagolni ám! Tehát csináljunk most valami loggert, aminek jelen esetben nem sok értelme lesz, de a példa kedvéért megteszi:

```
class LoggingPostRepository extends PostRepositoryDecorator {

      private $logger;

      public function __construct(PostRepository $repository, LoggerInterface $logger) { // interfészeket typehintelünk, ez fontos
            // ha nem így tennénk, akkor nem lehetne egymásba ágyazni több réteget
            $this->logger = $logger;
            parent::__construct($repository); // továbbdobjuk az absztakt konstruktorának
      }

      public function getForMainPage() { 
             $posts = $this->repository->getForMainPage(); // kikérjük a sima repository-ból
             $this->logger->info(sprintf("Just served %n posts", $posts->count())); // ellogoljuk hogy hány darabot szolgáltunk ki.. useful :D
             return $posts; 
      }

      // a többi metódust érintetlenül hagyjuk, de a logika hasonló
}
```

Na most hogy bonyolódott a helyzet, nézzük meg mi is történik, ha használjuk mindezt:

```
// ezt ugye IoC csinálja majd helyettünk
$cache = new Cache(); // implementálja a CacheInterface-t
$logger = new Logger();  // implementálja a LoggerInterface-t
$repository = new LoggingPostRepository(
                    new CachedPostRepository(
                              new SqlPostRepository($boszmeDB), // #magento
                              $cache),
                    $logger);
$posts = $repository->getForMainPage(); // ugyanazt adja vissza, mint az sqlpostrepository, 
// tehát nekünk fel se tűnik, ha valami ármány van a  háttérben
// ugyanez a helyzet a mongoDB-s verzióval is
// meghívódik a loggingrepository-ban a getForMainPage, aztán a cachedrepository-ban, végül pedig az sql-esben.
```

Amint láthatjuk, a lehetőségek a kombinációra szinte végtelenek. Amire nagyon ügyelni kell, az az, hogy minden esetben interfészeket typehinteljünk, mert különben beleerőszakoljuk az egyik osztályt a megvalósításba. Az interfészek jelenléte fogja nekünk lehetővé tenni hogy huncutkodjunk 🙂

Akinek nem világos bármi, az nyugodtan kérdezzen bátran!

<del>Akit pedig már halálraidegelt a kis preloader, az is szóljon!</del>
