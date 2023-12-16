---
id: 188
title: 'Prototype Pattern II &#8211; A klónok támadása'
date: '2015-01-26T14:14:24+01:00'
author: tacsiazuma
layout: post
guid: '{{ site.url }}/?p=188'
permalink: /2015/01/26/prototype-pattern-ii-klonok-tamadasa/
dsq_thread_id:
    - '3456602975'
    - '3456602975'
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
    - PHP
tags:
    - clone
    - design
    - pattern
    - php
    - prototype
---

A prototype pattern olyan esetekben lehet segítségünkre, mikor adott objektumból sok másolatot készítünk és mindeközben a teljesítményt tartjuk szem előtt. A minta a létrehozási minták közé tartozik és mint olyan, az egyik leghatékonyabb módja az objektumok létrehozásának.

<figure aria-describedby="caption-attachment-189" class="wp-caption aligncenter" id="attachment_189" style="width: 200px">![640px-Jango_Fett_Retouched](assets/uploads/2015/01/640px-Jango_Fett_Retouched-200x300.jpg)<figcaption class="wp-caption-text" id="caption-attachment-189">Jango Fett</figcaption></figure>

Abban az esetben használjuk, mikor egy objektum direkt példányosítása igen erőforrás igényes. Vegyünk egy Star Wars alapú mintát:

```
<pre data-language="php">abstract class JangoFett { // szegény Jango Fett már meghalt, így belőle nem lesz egy példányunk se
 
 protected $name = "Jango Fett";
 
 public function __clone() {
 // itt mehet valami kis testreszabás
 }
}
```

Itt létrehoztuk Jango Fett-et, a klónjaink ősét. Nem egy bonyolult osztály, így hát ne is ragozzuk a dolgot, inkább hozzuk létre az ő klónozásával létrejött rohamosztagosokat.

```
<pre data-language="php">class CloneTrooper extends JangoFett { // ellenben rohamosztagosból lesz bőven
 
 public function cantHitAnyone() {} // a rohamosztagosok bizony nem tudni kitől örökölték, hogy nem tudnak célozni 
 
}
```

Ez se egy túl bonyolult osztály, így ismét tovább lépünk és jöjjön a Kamino, ahol filmünkben a rohamosztagosok klónozását végezték.

```
<pre data-language="php">class Kamino {
 
 private static $clone;
 
 public function __construct() {
 $this->fillCache(); // kezdésként hozzunk létre egy általános példányt 
 } 
 
 public function getCloneTrooper() { // adjuk vissza a klónozott rohamosztagost
 return clone self::$clone;
 }
private function fillCache() {
 // itt valami naagy adatbázis lekérdezés zajlik
 self::$clone = new CloneTrooper($stuffFromAHeavyDbQuery);
 }
}
$kamino = new Kamino(); // Obi Van csak sok ezer klón után fog erre járni
$clone1 = $kamino->getCloneTrooper(); // első klónunk
$clone2 = $kamino->getCloneTrooper(); // második klónunk
```

Na, kész is az osztályunk. Mikor példányosítjuk azt, akkor meghívódik a fillCache metódus, amivel egy statikus változóba töltjük a példányosított rohamosztagosunkat. Ezen metódus az, amiben (vagy épp ami előtt) a példányosításhoz szükséges nagy erőforrás igényű műveletet végezzük, jelen esetben adatbázis lekérdezést, de ez lehet akár külső API meghívása, stb. Azért kell ezt elvégezni, mert **klónozni csak már létező objektumpéldányt tudunk**, érthető okokból, így kell egy hétköznapi módon létrehozott objektum.

Amikor meghívjuk a getCloneTrooper() metódust, akkor az klónozza a változónkban letárolt objektumot és ezt adja vissza. Klónozás során a példányváltozókról is másolat készül, így abban az esetben is jól jöhet, ha a létrehozott objektumok csak kismértékben különböznek egymástól (pl. 10 attribute-ból csak egy van, amiben különböznek, mivel ekkor betöltünk egy általános példányt és klónozás után csak azt az egyet változtatjuk meg). Az ismeretlen kulcsszó, a `clone` hasonlít a `new`-ra, ellenben ez nem a `__construct()` metódust, hanem a `__clone()`-t hívja meg, miután lemásolta az eredeti objektumot és a másolatot adja vissza értékül.

> Megjegyzés: PHP-ben a \_\_clone() mágikus függvény is meghívásra kerül a másolat létrejöttekor, viszont direktben nem érhető el.

Ha kérdésed van, tedd fel bátran!