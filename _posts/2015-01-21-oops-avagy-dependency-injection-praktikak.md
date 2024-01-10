---
id: 67
title: 'OOP&#8217;s I DI&#8217;d it again!, avagy dependency injection praktikák'
date: '2015-01-21T12:12:35+01:00'
author: tacsiazuma
layout: post
guid: 'http://iacwebshop.hu/?p=67'
permalink: /2015/01/21/oops-avagy-dependency-injection-praktikak/
dsq_thread_id:
    - '3440960372'
    - '3440960372'
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
    - Advanced
    - PHP
tags:
    - dependency
    - design
    - injection
    - manager
    - oop
    - pattern
    - php
    - service
---

![49734](assets/uploads/2015/01/49734-300x188.jpg)Mielőtt bármibe is belekezdenénk, először is tisztáznunk kell mi is az a dependency injection ( függőség injektálás, magyarul elég morbidul hangzik). Az objektumorientált programozásban az osztályaink egymással közreműködnek és legtöbb osztályunk (nem mind, hiszen az lehetetlen) explicit módon igényli egy másik használatát. Ha használtunk már pl. PDO-t egy osztályunkban, akkor is pont ezt tettük. Anélkül az osztály nélkül a miénk sehogyse működne, függ tőle (*depends on*). Ha még most sem világos, akkor vegyünk egy konkrét példát.

#### A programozó, mint osztály

```
class Programozo {
    public function __construct(KaveAutomata $kaveautomata, Eclipse $ide) {
          $kaveautomata->rugdos()->iszik();
          $ide->ujraInditMertMarBelassult();
    }
}
```

A fenti példa kicsit unortodoxnak tűnhet, de mindjárt elmagyarázom. A dependency injection egyik legegyszerűbb módja az, hogyha a konstruktoron át, a meghíváskor adjuk át a szükséges osztályok példányait (constructor injection). A programozónak ugye szüksége van egy fejlesztői környezetre, amin dolgozik, valamint esetünkben kávéra, ahhoz hogy működni tudjon. Ha ezek nincsenek meg, akkor bizony nem tudjuk munkára fogni az illetőt. A fenti példában explicit módon kikötöttük, hogy automatás kávét iszunk és Eclipse-t használunk. Ez szép és jó, ellenben a kódunkat (és vele együtt a programozót is) bebetonoztuk a kódunkba. Ugyanis mi van akkor, ha elmegyünk egy másik helyre, ahol kotyogós kávéfőző van, netán PhpStorm vagy épp NetBeans? Nos a mi programozónk ezt nem fogja elfogadni <del>és hibaüzenettel elszáll</del>, mert neki bizony elvei vannak.

#### Megoldás 0.2.13-rev42342

Mégis mit tehetnénk az ügy érdekében? Ha nem kötjük ki explicit módon, hogy milyen osztályokat igényel a programozónk, akkor megnyitjuk az utat más környezetek számára is, ellenben ez nem igaz a statikusan típusos nyelvekre, ahol nincs ilyen kiskapunk. Gondolkozzunk tehát úgy, hogy azt más nyelvekben is használni tudjuk. Az egyik megoldás, hogyha a konstruktorunkban nem magát az osztályt kötjük ki, azaz typehinteljük, hanem az interfészt, amit az implementál.

> **Typehint**: A PHP 5 óta lehetőségünk van arra, hogy az objektumaink metódusaiban kikényszerítsük a kapott paraméterek típusát. Lehet adott osztályt, implementált interfészt, tömböt, vagy meghívható függvényt kikötni.

Így ha van két osztályunk, amik egyazon interfészt implementálják, akkor gond nélkül át tudjuk adni azt.

```
interface KaveLeloHely {}
class KaveAutomata implements KaveLeloHely {}
class KotyogosKaveFozo implements KaveLeloHely {}

interface FejlesztoiKornyezet {}
class Eclipse implements FejlesztoiKornyezet {}
class NetBeans implements FejlesztoiKornyezet {}
class Programozo {
        public function __construct(KaveLeloHely $kave, FejlesztoiKornyezet $ide) {}
}
```

A fenti példában definiáltunk két interfészt, amiket implementálnak az osztályaink, ezáltal a konstruktorban megadott helyre injektálhatóak. Ez kicsit sok kódnak tűnhet egy osztály igényeinek kielégítésére, így okkal merülhet fel egyeskben a kérdés:

> Mi lenne, ha csak szimplán példányosítanám a konstruktoron belül?

```
class DatabaseAndStuff {

    public function __construct() {
        $db = new SomeSQLAdapterIMade();
    }
}
```

A fenti példa már kicsit közelebb áll a valósághoz, itt egy SQL adaptert példányosítunk a konstruktorunkon belül, viszont ez a módszer az előbbinél rosszabb, hiszen ismét bebetonozzuk az osztályunkat ([tight coupling](http://en.wikipedia.org/wiki/Coupling_%28computer_programming%29)). Képzeljük el, hogy a kódunkat át akarjuk vinni egy másik környezetbe, ahol nem SQL-ből nyernénk ki az adatokat, hanem NoSQL megoldással, netán egy SQL kapcsolat nélküli környezetben tesztelnénk azt mock object-el? Nos akkor bizony át kell írjuk a kódunkat, azt pedig nem szeretnénk. PHP esetében nem túl bonyolult, de az előbb beszéltük, hogy rugaszkodjunk el tőle és gondolkodjunk más nyelvekkel. Nos egy JAR fájlban (vagy akár PHAR, ha már PHP) nem nagyon fogunk turkálni, így ez a megoldás biztos nem jöhet számításba.

A legközelebbi cikkben bele fogok nyúlni más tervezési mintákba is, hogy még tovább vigyük a megoldást. A dolog lényege, hogy egy factory-t fogunk használni az osztályon belül (csinálhatjuk kívülről is, erre is kitérek majd), de a factory osztályt az osztályon kívül fogjuk konfigurálni, így téve a kódot újrahasznosíthatóvá.
