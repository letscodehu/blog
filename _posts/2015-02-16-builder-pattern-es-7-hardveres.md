---
id: 264
title: 'Builder Pattern és a 7 hardveres'
date: '2015-02-16T16:40:15+01:00'
author: tacsiazuma
layout: post
guid: '{{ site.url }}/?p=264'
permalink: /2015/02/16/builder-pattern-es-7-hardveres/
dsq_thread_id:
    - '3520746105'
    - '3520746105'
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
    - 'Design Pattern'
    - PHP
tags:
    - builder
    - composite
    - controller
    - design
    - oop
    - pattern
    - php
---

Mai cikkemben a Builder Pattern kerül terítékre, hogy egy újabbat leleplezzünk a létrehozási minták  
közül. Mielőtt azonban beleugranánk abba, hogy mit is csinálunk ezen mintában, előtte valamit át kell beszélnünk, ami az objektumaink interfészével és működésével kapcsolatos.![inception-trailer-movie-leonardo-de-caprio1](assets/uploads/2015/02/inception-trailer-movie-leonardo-de-caprio1-1024x445.jpg)

Vegyünk egy konkrét példát:

Van egy controllerosztályunk, legyen pl. AjaxController, amivel az oldalunkra érkező ajax lekéréseinket szeretnénk kezelni.

```
<pre data-language="php">class AjaxController {
  public function getController() { // a get kéréseinkhez tartozó action
     // itt valami roppant izgalmas történik
     return new JsonModel() {  } // egy Json modelt adunk vissza, amit aztán lerenderel a meghívó osztály
  }
}
```

Nos, osztályunk túl sok mindenre nem alkalmas jelenleg, így elkezdhetünk hozzáadogatni mindenféle csili-villi függvényeket, amitől aztán szép nagyra hízik. A konstruktorában meghívunk egy adatbázis adaptert, lesz servicelocatorunk, na meg még ki tudja micsoda.

Utána csinálunk esetleg még egy controllert, ami a frontendért felelős, egyet ami az admin felületért és aztán látjuk majd, hogy hoppá, mintha lenne valami rendszer az osztályainkban. Ugyanazokat a függvényeket, objektumokat használjuk, stb. Ezt hogy lehetne orvosolni, hiszen a kódismétlés főben járó hiba.

#### 1. Öröklődés

Bizony-bizony, a fajfenntartás fontos dolog, ez alól a viselkedés alól az osztályaink sem kivételek. Tehát az ismétlődő metódusokat, netán változókat/konstansokat egy ősosztályba tesszük és aztán onnan származtatjuk azt, ezzel érve el a kívánt hatást.

Csináljunk például egy viewhelpert, ami abban segít majd, hogy a template-ünkben vagy bárhonnan elérve hozzá tudunk adni script-eket, amiket majd a head vagy éppen body tag-ok legvégére szúr be rendereléskor az applikációnk.

Ezekből, fajtánként (pl. HeadScript, InlineScript, HeadLink, HeadMeta) csak egy kell, ezért egy Singleton osztályból fogjuk származtatni őket, ami egy protected konstruktorral és egy statikus getInstance() metódussal el is látja azt, biztosítva a singleton viselkedést.

Mik is kellenek egy ilyen osztályba? Mivel most a HeadScript-ről beszélünk, ezért fájlokat és script-eket is egyaránt szeretnénk hozzáadni, mégpedig metódusokkal.

```
<pre data-language="php">class HeadScript extends Singleton {
     
     private $scripts = array(); // a scriptjeinket tároló tömb
     public function appendFile($file, $type="text/javascript", $attr = array()) {
        // a tömb végéhez ad egy scriptfájlt
     } 
     public function prependFile($file) {
         // a tömb elejéhez ad egy scriptfájlt
     }
     public function offsetFile($file) {
         // a tömb adott pozíciójára tesz egy fájlt
     }
     public function appendScript($script, $type="text/javascript", $attr = array()){
       // a tömb végéhez ad egy scriptet
     }   
     public function prependScript($script, $type="text/javascript", $attr = array()){      // a tömb elejéhez ad egy scriptet 

    }
    public function offsetScript($script, $type="text/javascript", $attr = array()) {         // adott offsethez adunk script-et 
    } 
   public function getMarkup() { 
      // itt végigjárja a tömböt és elkészíti a HTML kimenetet, majd visszaadjuk azt 
    } 
}
```

El is készült a view helperünk, csináljunk hát egy másikat. Hoppá, amikor az InlineScript-et csinálnánk, teljesen ugyanezt kell megcsináljuk, csak a getMarkup metódust máshol hívnánk meg a renderelés során. Sőt, ha megfigyeljük a getMarkup metódus minden ilyen viewhelperünk esetében szükséges lesz.

Akkor hogy is kellene ezt az öröklődést megszervezni?![inheritance](assets/uploads/2015/02/inheritance-1024x465.png)

A fenti ábrán követhető végig az öröklődési lánc, aminek során osztályaink elnyerik kívánt működésüket, a lehető legkevesebb kóddal, persze itt még interfészeket is implementálhatnánk és hasonlók, de nem akarom bonyolítani a dolgot, csupán szemléltetni akartam, hogy az öröklődéses módszer miből is áll.

#### Kompozíció

A másik módszer során a kívánt működést úgy érjük el, hogy különféle osztályokat használunk fel és építünk be az osztályunkba, így azok interfészét fogjuk használni közvetett módon.

Hogy egy egyszerű példával éljek, egy autó működéséhez szükség van motorra, kormányra, kerekekre, stb, amiket magába foglal.

Amikor egy ilyen osztály referenciáját példányváltozókba tesszük, akkor az ő interfészét közvetett módon tudjuk elérni és ezen metódusokat igazából csak továbbítjuk az adott osztály metódusához.

#### Számítógép szervíz

Az objektumkompozíciót a legjobban a builder pattern egy példáján keresztül tudom bemutatni, amihez egy kis hardveres külső segítségre lesz szükségem, íme:[![fat computer geek](assets/uploads/2015/02/fat-computer-geek.jpg)](assets/uploads/2015/02/fat-computer-geek.jpg)

Igen, tudom, hogy mindenki jobban örülne, ha [O.C.C](https://s-media-cache-ak0.pinimg.com/736x/4c/2e/82/4c2e82ca2759d1dac6b3e04583f4ad38.jpg) módjára motorokat építenénk és nem számítógépeket, de hozott anyagból kell dolgozzak.

Nos akkor tegyük fel, hogy a kedves i5-ös hajtotta laptopom elkezd haldokolni (ami egyébként tényleg így van) és szeretnék beruházni egy újba, mielőtt a GRUB-ig se jutok el indításkor. Én leszek ez esetben a kliens, aki megkéri a Builder-t (fenti barátunkat), hogy dobjon már össze egy jól szituált gépet. Elmondhatom neki úgy is, ahogy a gödöllői gyros-osnak, hogy "egy gyros tálat, elvitelre, csípős és hagyma nélkül.... mondom tálat, nem-nem kérek bele csípőst, a hagy.. mindegy", azaz egyesével elmondom neki, minden elemét a "specifikációnak", vagy valamennyire rábízhatom a döntést, hisz ő a szakavatott és csupán annyit mondok neki, hogy dobjön össze nekem egy "ütős gépet". Ő aztán <del>legjobb tudása szerint</del> összerakja nekem a gépet és a végén mond egy összeget (ami haveri alapon 110%). Na de nézzük meg ez hogy nézne ki a gyakorlatban!

```
<pre data-language="php">class Tacsiazuma { // igen, én leszek a kliens

      private function ujGep() {

          $this->ujGep = $this->hardveresHaver->rakjOsszeEgyUtosGepet(); // itt hívjuk meg a hardveres havert és átadjuk neki az igen rövid specifikációt, miszerint "ütős gépet" rakjon össze.
      }
}
```

```
<pre data-language="php">interface Termek { // ez az interfész lesz az, amit minden hardverelemünk implementálni fog, csupán azért van rá szükség, hogy a srác nehogy mellényúljon és mákdarálót szereljen be procihűtő helyett
       public function nev(); // ez lesz az elem neve
       public function ar(); // ez pedig az ára
}
```

Nos, akkor eddig megcsináltuk a kliensünket, aki majd meghívja a buildert, valamint egy interfészt, amit aztán ráhúzunk minden hardverelemre, hiszen mindnek lesz neve és ára, ingyen senki nem rakja össze. Akkor jöjjenek a termékcsoportok, amik implementálják ezt az interfészt és szűkítik a kört.

```
<pre data-language="php">abstract class Processzor implements Termek {}
abstract class Alaplap implements Termek {}
abstract class Memoria implements Termek {}
abstract class VGA implements Termek {} // ilyenre nincs is szükségünk, nemde? :)
abstract class Munkadij implements Termek {}
```

Szűkítettük a kört, megvannak a termékcsoportok, akkor most készítsünk el pár valós terméket.

###### Processzorok

```
<pre data-language="php">class Core_I7 extends Processzor { // bang, közel 200k csak a procink
      public function nev() {
            return "Intel Core I7-5930K 3.50 GHz";
      }
      public function ar() {
            return 178000;
      }
}
class AMD_A10 extends Processzor { // ez egy sokkal szerényebb összegért a miénk lehet
      public function nev() {
           return "AMD A10-5700 3.40GHz"
      } 
      public function ar() {
          return 46000;
      }
}
```

###### Memória

```
<pre data-language="php">class DDR4 extends Memoria { 
      public function nev() {
            return "16GB XPG Z1 DDR4 2400MHz";
      }
      public function ar() {
            return 97000;
      }
}
class DDR3 extends Memoria { 
      public function nev() {
           return "16GB XPG V1.0 DDR3 1600MHz "
      } 
      public function ar() {
          return 47000;
      }
}
```

###### Alaplap

```
<pre data-language="php">class SocketAM3 extends Alaplap { 
      public function nev() {
            return "Crosshair IV Extreme";
      }
      public function ar() {
            return 78000;
      }
}
class SocketAM1 extends Alaplap { 
      public function nev() {
           return "AM1B-ITX"
      } 
      public function ar() {
          return 12000;
      }
}
```

###### VGA

```
<pre data-language="php">class Nvidia extends VGA { // csak szolidan
      public function nev() {
            return "PNY VCQK5000-PB Quadro K5000 4GB GDDR5 PCIE";
      }
      public function ar() {
            return 678000;
      }
}
class Integralt extends VGA { // ez egy sokkal szerényebb összegért a miénk lehet
      public function nev() {
           return "Intel HD"
      } 
      public function ar() {
          return 0; // beony, ingyé'
      }
}
```

###### Munkadíj

```
<pre data-language="php">class HaveriAlapon extends Munkadij { // bang, közel 200k csak a procink
      public function nev() {
            return "Ebből üzemeltetem a VPS-t";
      }
      public function ar() {
            return 10000;
      }
}
class MindenkiMasnak extends Munkadij { // ez egy sokkal szerényebb összegért a miénk lehet
      public function nev() {
           return "Munkadíj"
      } 
      public function ar() {
          return 5000;
      }
}
```

Most, hogy ezekkel megvolnánk, jöjjön a komplett gép osztálya, amibe beleszuszakoljuk mindezt. Mielőtt lázadozni kezdenétek, hogy nincs benne egér, meg nem vizsgáltuk a foglalatokat, el kell keserítselek, hogy az időm véges, erre futotta 😛

```
<pre data-language="php">class KomplettPc {
    
     $komponensek = array();

     public function beleszuszakol(Termek $termek) { // a kolléga ISO szabvány szerint dolgozik, így kikötjük, hogy mákdaráló nem mehet bele, csak a Termek interfészt implementáló osztályok
          array_push($komponensek, $termek);
     }
     public function szamlaReszletei() { // kiíratjuk sorban a komponensek nevét és árát, hogy lássuk mennyibe fáj a dolog
          foreach ($komponensek as $komponens) {
               echo "Neve:". $komponens->nev()."<br/>"; 
               echo "Ára:". $komponens->ar()."<br/>";
          }
     }
}
```

Na és akkor most boncoljuk fel a kollégát és lássuk hogy működik! Először is definiálok neki egy interfészt, de ez már csak az én rigolyám.

```
<pre data-language="php">interface HardverBuilder {
    public function oltozzMaFel();
}

class HarderesHaver implements HardverBuilder {
    public function oltozzMaFel() {
       exit('NOOOOO!'); // nem, nem tudjuk felöltöztetni a tagot.. ez van, majd legközelebb!
    }

    public function rakjOsszeEgyUtosGepet() { // na igen, a végösszeg fájni fog
       $gep = new KomplettPc();
       $gep->beleszuszakol(new SocketAM3());
       $gep->beleszuszakol(new Core_I7());
       $gep->beleszuszakol(new Nvidia());
       $gep->beleszuszakol(new DDR4());
       $gep->beleszuszakol(new HaveriAlapon());

    }
    public function rakjOsszeValamitAnyamnak() { // az ősöknek is kell valami gyengébb konfig, nemde?
       $gep = new KomplettPc();
       $gep->beleszuszakol(new SocketAM1);
       $gep->beleszuszakol(new AMD_A10);
       $gep->beleszuszakol(new Integralt());
       $gep->beleszuszakol(new DDR3());
       $gep->beleszuszakol(new HaveriAlapon()); // mindegy mit csinálok, engem itt átb*sznak :D
    }
}
```

A fentiekből látszik, hogy a számítógépünk több komponensből áll, amiket jelen esetben egy tömbben tárolunk az egyszerűség kedvéért, de könnyebben elérhető helyre is kerülhet. Az interfészeiket közvetlenül nem, de közvetve elérjük és mindezt nem öröklés útján, hiszen a komplettpc osztályunk nem extendelt semmit sem. A folyamat roppant egyszerű, megkérjük a builder osztályt, hogy rakjon össze nekünk egy kompozit osztályt és anélkül, hogy mi ( vagy épp ő) rakosgatnánk bele az elemeket, hogy elérjük a kívánt funkcionalitást, készen kapjuk tőle.