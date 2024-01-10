---
id: 536
title: 'Observer pattern és a Robotics Facility'
date: '2015-06-16T08:00:42+02:00'
author: tacsiazuma
layout: post
guid: '{{ site.url }}/?p=536'
permalink: /2015/06/16/observer-pattern-es-a-robotics-facility/
dsq_thread_id:
    - '3852265468'
    - '3852265468'
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
    - 'Design Pattern'
    - PHP
tags:
    - event
    - mvc
    - observer
    - pattern
    - php
    - subject
    - subscriber
---

<figure aria-describedby="caption-attachment-537" class="wp-caption aligncenter" id="attachment_537" style="width: 724px">![starcraft_2_observer_by_worthart-d4ibdiy](assets/uploads/2015/06/starcraft_2_observer_by_worthart-d4ibdiy.jpg)<figcaption class="wp-caption-text" id="caption-attachment-537">Protoss observer - Ha nem ismerős, akkor annak idején Te is lemaradtál a dolgokról.. Ez a pattern talán segíthet, hogy ne történjen meg újra!</figcaption></figure>

Akit kapott már hátba egy hadseregnyi zergling, az pontosan tudja, hogy jó dolog, ha időben értesülünk a dolgokról körülöttünk. Az objektumokkal sincs ez másként, bizony őket sem érinti pozitívan, ha <del>bezergelik őket</del> lemaradnak a számukra fontos eseményekről.

A mostani témánk az **observer pattern** lesz, ami a viselkedési minták egyike. Nem, nem a kémkedésről szól, a működése leginkább a hírlevelek világához kötődik, de nem kell megijedni, csak a valóságközeli példák miatt hoztam fel.

Tegyük fel, hogy szeretnénk <del>hírlevelet</del> értesítőt küldeni a felhasználóinknak, amikor egy adott adatbázis tábla módosul. Az ilyen és hasonló feladatokra találták ki az observer pattern-t, aminek a lényege, hogy az A objektum "feliratkozik" bizonyos eseményekre, ami események bekövetkeztekor értesítve lesz, vagyis meghívunk rajta egy metódust. De lássuk ezt valami csontszáraz példán át:

Először is hozzunk létre egy feliratkozót, sőt... először egy interfészt, amit a feliratkozónak implementálnia kell. Később meglátjuk mire is jó mindez:

```
interface DatabaseEventAwareInterface { // ami ezt az interfészt implementálja, azon meghívhatóak lesznek az alábbi függvények, tehát a programunk nem fog hibára futni, ha megpróbálja azt
     public function onUpdate(Record $record); // az adatbázis update-kor meghívódó metódus
     public function onInsert(Record $record); // beszúráskor hívódik meg
     public function onDelete(Record $record); // törléskor hívódik meg
}
```

Most, hogy kész az interfész, nem ártana egy osztályt is kreálni, amivel megvalósítjuk:

```
abstract class DatabaseObserver implements DatabaseEventAwareInterface {
     public function onUpdate(Record $record) {
      // override-ra vár
     }
     public function onInsert(Record $record) {
      // override-ra vár
     }
     public function onDelete(Record $record) {
     // override-ra vár
     }
}
```

Na jó, hazudtam, ez még nem a megvalósítás volt...

```
class OurFancyObserver extends DatabaseObserver { // leszármaztatjuk, ennek fényében megkapjuk a szép üres metódusokat fent, ahhoz, hogy valamit érjünk is vele, override-olni kell azt
    public function onUpdate(Record $record) {
    echo "Updated ID: ".$record->getId().PHP_EOL; // A Record objektumnak legyen ez esetben egy public getter-e az ID mezőre.
    }

    public function onDelete(Record $record) {
    echo "Deleted ID: ". $record->getId().PHP_EOL;
    }
    

    public function onInsert(Record $record) {
    echo "Inserted ID: ". $record->getId().PHP_EOL;
    }
}
```

Bumm, ennyi volt az observer.. viszont ez még édeskevés. Most csak leírtuk milyen is külsőre egy átlag feliratkozó, <del>nem pipálja ki a toolbar-okat és IE-t használ</del> viszont valamire fel is kéne iratkozni.

Hozzuk létre hát az adatbázis <del>osztályunkat</del> eseménykezelő interfészt:

```
interface EventManagerInterface { 
      public function attach(DatabaseAwareInterface $observer); // az observer-eink a typehintelt interfészt fogják implementálni, így nem fut cs*csre a kódunk, az átadáskor. Ezzel a metódussal tudjuk majd ráakasztani az observerünket az eseménykezelőre, ami az átadott példányon meghívja az egyes metódusokat amikor az adott esemény lezajlik
}
```

Jöjjön akkor ismét a megvalósítás, eléggé lebutítva persze:

```
class DatabaseEventAndStuff implements EventManagerInterface {

     private $observers = array(); // a feliratkozókat tartalmazó tömb.     

     public function attach(DatabaseAwareInterface $observer) {
           array_push($observer, $this->observers); // feltoljuk a listára az observerünket. Persze ez a módszer nem a legjobb, mivel egy tömbből kikapni 1 index-et ilyen formában nem túl egyszerű, de pl. visszaadhatjuk az index-ét ezen metódusban, stb.
     }
     public function insert(Record $record) {
           // valami adatbázis logika
           foreach ($this->observers as $observer) { // a konkrét értesítés

                $observer->onInsert($record); // itt értesítjük az egyes observer-eket.
           }
     }

}


// menjenek tovább, nincs itt semmi látnivaló! Csak a hitelesség kedvéért implementáljuk a fent említett getId-t és a Record osztályt.
class Record {

    private $id;

    public function __construct($id) {
         $this->id = $id;
    }

    public function getId() {
          return $this->id;
    }

}
```

Végül pedig használjuk az Erőt, vagy elég azt a pár osztályt is, amit csináltunk.

```
$db = new DatabaseEventAndStuff(); // példányosítunk egy jól szituált adatbázis osztályt
$db->attach(new OurFancyObserver()); // ráakasztunk az adatbázisra egy observer-t
$db->insert(new Record(1)); // végül beillesztünk egy rekord-ot.
// Inserted ID: 1
$db->delete(new Record(2)); 
// Deleted ID: 2
$db->update(new Record(3));
// Updated ID: 3
```

Amint láthatjuk a dolog lényege annyi, hogy az adott eseménykezelőre feliratkoztatunk egy megfigyelőt (átadunk neki egy referenciát az observer osztályra), ami az adott események esetén meghív az adott osztályon egy metódust.  
A problémát ezen minta esetében a memória jelenti. Ugyanis amikor feliratkoztatunk egy osztályt, akkor ún. strong reference-ként adjuk át az adott osztályt, ami azt jelenti, hogy a garbage collection nem tudja kitakarítani azt a memóriából. Ezt elkerülendő weak reference-ként szokás átadni az adott példányt. Ez PHP-ben nem elérhető, viszont itt nem is gyakori, hogy memory leak-el küdeznénk, lévén nem sok hosszan futó process-t írnak a nyelvben (Kivéve a hozzám hasonló elvetemültek).

Az observer pattern az MVC architektúrának képezi egyik fontos építőelemét. Ha esetleg érdekli a népet, akkor ennek megvalósításáról is írok legközelebb.
