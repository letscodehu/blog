---
id: 169
title: 'Tervezési minták &#8211; Singleton és a hét törpe'
date: '2015-01-24T00:00:23+01:00'
author: tacsiazuma
layout: post
guid: '{{ site.url }}/?p=169'
permalink: /2015/01/24/tervezesi-mintak-singleton-es-het-torpe/
dsq_thread_id:
    - '3449839117'
    - '3449839117'
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
    - Intermediate
tags:
    - creational
    - design
    - oop
    - pattern
    - php
    - singleton
---

Elérkeztünk hát a tervezési minták taglalásához, így hát vegyük is át pontosan mit is értünk ez alatt.

> Az [informatikában](http://hu.wikipedia.org/wiki/Informatika "Informatika") **programtervezési mintáknak** (angolul *Software Design Patterns*) nevezik a gyakran előforduló programozási feladatokra adható általános, újrafelhasználható megoldásokat. Egy programtervezési minta rendszerint egymással együttműködő objektumok és osztályok leírása. - Wikipedia

A tervezési mintákat az informatikába Christopher Alexander építész ötlete nyomán hozta be egy programozókból álló négyes, az ún. Gang of Four a 90-es évek végén. Összegyűjtöttek 23 ilyen gyakran előforduló mintát és a Design Patterns c. könyvben forradalmasították az objektumorientált programozást.

Három csoportra tagolhatók, melyek közül mi most az első csoportból emelnénk ki a legegyszerűbbet, mégpedig a singleton-t.![post-01052013](assets/uploads/2015/01/post-01052013-300x300.jpg)

A singleton (magyarul egyke) minta lényege, hogy az adott osztályunknak maximum egy példánya lehet. Ezt úgy tudjuk elérni, ha megakadályozzuk, hogy a new kulcsszóval példányosítani lehessen (tehát egy private konstruktort definiálunk az osztályunkon belül), ellenben egy publikus interfészen keresztül lehetővé tesszük ennek az egy példánynak a létrehozását és elérését. Erre egy statikus metódust fogunk használni, hiszen az példányosítás nélkül is rendelkezésünkre áll. Példa minderre:

```
<pre data-language="php">class Singleton {
      
   private static $object = null; // az objektum, amiben tárolni fogjuk a példányunkat 

   private function __construct() { // mivel a konstruktorunk private, a new kulccszó kívülről hibaüzenetet eredményez

   }

   public static function getInstance() {   
   if (self::$object == null)) { 
      self::$object = new self(); // a self kulcsszóval tudunk statikus környezetben az osztályra hivatkozni
   }
   return self::$object;   
   }
}
```

Mit is csinál a fenti kód? Osztályunkban szerepel egy statikus változó, amiben az objektumpéldányt fogjuk tárolni. A konstruktorunk privát, ezért kívülről nem hívható meg, valamint definiáltunk egy statikus metódust, ami meghíváskor ellenőrzi, hogy a statikus változónkba létrehoztuk-e már az objektumunk példányát és ha nem, akkor példányosítja azt és letárolja benne. Ezután visszaadjuk az osztályunk példányát, amiből így mindig csak MAXIMUM EGY lehet.

> Hol van ennek értelme?

Nos, joggal gondolhatnánk, mégis mi értelme lekorlátozni a példányok számát egyre. A fenti mintának akkor van haszna, amikor egy adott osztály működésére több másik osztályban is igényt tartunk, de két ilyen felhasználás között adatot viszünk át. Képzeljünk el például egy osztályt, ami a konfigurációs fájlokat nyalja végig és aztán innen is onnan is el tudjuk érni azt, anélkül, hogy újabb példányokat hoznánk létre. Netán nagy erőforrás igényű és így csak egy példányra van szükségünk belőle (pl. adatbázis kapcsolat).

> Miért nem használunk akkor static metódusokat/változókat, azokat még példányosítani sem kell!

Jogos a kérdés, a static osztályokat sokszor szembeállítják a singletonnal (ami utóbbit sokan anti-pattern-nek minősítenek). Álljanak hát itt a singleton előnyei a static osztályokkal szemben:

1. A singleton implementálhat interfészeket és kiterjeszthet más osztályokat (A static is, de a példányváltozókat és metódusokat nem tudja örökölni).
2. A singleton, ha nem használjuk, csak annyi memóriát használ, amennyi a fent bemutatott kódhoz szükséges. Ha az osztályunk teljesen static, akkor minden metódusa azonnal elérhető, ellenben a memóriát is felhasználha hozzá. (Emlékszünk, hogy nagy erőforrásigényű osztályok esetére is javasoltuk?)

> Update: Facebook-on valaki megjegyezte, hogy miért nem folytattam a singleton ősosztállyal, így hát álljon itt annak a problémának is a megoldása:

#### Az ősosztály

Na szóval a probléma a következő, akarunk egy osztályt létrehozni, ami továbbörökíti azt a tulajdonságot a leszármazottaiba, hogy maximum 1 példányuk lehet.

Nos akkor vágjunk is bele!

```
<pre data-language="php">abstract class Singleton {

    private static $map = array(); // egy asszociatív tömbben (map) fogjuk eltárolni az egyes osztályok név->objektum párját.
 
    protected function __construct() {} // a konstruktorunk protected, mivel a kölyköknek is kell hozzáférést biztosítani

    public static function getInstance() { // ez továbbra is publikus.
        $class = get_called_class(); // ez a funkció visszaadja a meghívott osztály nevét string-ként.
        if (!isset(self::$map[$class])) { // megnézzük, hogy van-e már adott osztályhoz tartozó példányunk map-ben, ha még nincs, akkor létrehozunk egyet, mivel a konstruktort tőlünk örökölte, ezért nem kapunk hibaüzenetet
             self::$map[$class] = new $class(); // a $class szócska egy ún. variable variable, vagyis a változó értékét helyettesíti be a PHP.
        }
        return self::$map[$class];

    }

}

class Bambi extends Singleton {}
class Bombi extends Singleton {}

var_dump(Bambi::getInstance());
var_dump(Bombi::getInstance());
var_dump(Bambi::getInstance());
var_dump(Bombi::getInstance());
```

Na mit is műveltünk az imént? Egy absztrakt ősosztályt csináltunk, aminek a konstruktora protected, ezért kívülről nem, de a gyermekosztályokból elérhető. Az osztályunk egy statikus asszociatív tömbjében tároljuk a példányokat. Ez végzi a konkrét kiszolgálást.

A self kulcsszóra hívnám fel itt a figyelmet. Ugye azt beszéltük korábban, hogy ez az osztályra önmagára vonatkozik. Ellenben arról nem volt szó, hogy mi a helyzet öröklődéskor. Amikor egy osztály örökölt egy functiont, amiben szerepel a self kulcsszó, akkor az **arra az osztályra vonatkozik, amelyik azt definiálta, esetünkben a Singleton-ra.** Így tudunk a Singleton osztályban definiált $map-re hivatkozni a leszármazottakban és azzal dolgozni.

> Ennek megoldására bevezették az ún. late static bindingot, aminek a lényege az, hogyha a `self` kulcsszó helyett a `static` kulcsszót használjuk, akkor az arra az osztályra vonatkozik, amiből meghívjuk.

Tehát amikor meghívjuk a Bambi::getInstance() metódusát, akkor az nem a Bambi::$map-be fog nézelődni, hanem a Singleton::$map-ben. Megnézi, hogy létezik-e a Singleton::$map\['Bambi'\] kulcs és ha nem, akkor a new Bambi()-val példányosítja azt és eltárolja benne. Később ehhez a példányhoz fogunk hozzáférni, akárcsak egy szimpla singletonnál.

A kódunk végén meghívtam párszor a metódusokat és kidumpoltam őket, ahol jól látható, hogy végig az #1 (Bambi) és #2-es (Bombi) számú objektumokat használjuk.