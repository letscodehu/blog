---
id: 1178
title: 'She wants the DI'
date: '2016-07-16T12:24:46+02:00'
author: tacsiazuma
layout: post
guid: '{{ site.url }}/?p=1178'
permalink: /2016/07/16/she-wants-the-di/
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
image: 'assets/uploads/2016/07/09202140/dip.jpg'
categories:
    - Architecture
    - 'Design Pattern'
tags:
    - dependency
    - di
    - dip
    - injection
    - inversion
    - php
    - solid
---

A SOLID sorozatunk utolsó része következik, ahol a Dependency Inversion Principle, röviden DIP lesz terítéken. Alkalmazásunk felépítését tekintve többszintű hierarchiát képez. Ha megvizsgáljuk az osztályainkat és azok függőségeit, akkor egy faszerkezetet rajzolnak ki, ahol a fa gyökere felé haladva egyre magasabb és magasabb szintű osztályok következnek. [![tree-451x320](assets/uploads/2015/12/tree-451x320.png)](assets/uploads/2015/12/tree-451x320.png)Amikor tervezzük az alkalmazásainkat, a gyakorlat az, hogy először azokkal az alacsonyszintű osztályokkal kezdjük, amik az egyszerű műveleteket végzik, mint a lemezelérés, hálózati protokollok, stb. (Ezek lesznek a levelek) Ezután fogjuk ezek működését egységbe zárni magasabb szintű osztályainkba, ahol a komplex logika található (üzleti folyamatok, stb.).

Ahogy a sorrendből is lehet rá következtetni, ez utóbbiak függnek az alacsony szintű osztályoktól. Ebből kifolyólag az előbbi elgondolás, miszerint a low-level osztályoktól a high-levelek felé haladunk a megvalósítás során. A probléma itt a flexibilitás lesz, ugyanis ha az egyik alacsonyszintű osztályt le kell cserélni valahol, akkor meg vagyunk lőve, mert a magasabb szintű osztályainkat ennek implementációjára építettük.[![dip](assets/uploads/2016/07/dip.jpg)](assets/uploads/2016/07/dip.jpg)

Szemléltetésként nézzünk egy klasszikus példát a fenti esetre, amikor létrehozunk egy Copy modult, ami a billentyűzetről olvas be karaktereket és a nyomtatóra írja ki azokat. A magassztinű osztály, ami a logikát tartalmazza majd, a Copy lesz. Az alacsonyszintű pedig a KeyboardReader és PrinterWriter.

Ha a fentiek szerint terveztük meg a rendszerünket, akkor a magasszintű osztályba bele van betonozva a két alacsonyszintű implementáció. Ebben az esetben, ha meg akarnánk változatni a modul működését, hogy a nyomtató helyett egy fájlba írja azt, a FileWriter osztály segítségével, bizony bele kéne nyúlni a Copy osztályba (egy percre tételezzük fel, hogy rengeteg logikával van megáldva és nehezen tesztelhető):

```
<pre data-language="php">class Copy {
     
     private $reader, $writer;

     public function __construct(KeyboardReader $reader, PrinterWriter $writer) {
          $this->reader = $reader;
          $this->writer = $writer;
     }
}

class KeyboardReader {
    public function read() {
        // cin >> rucsok
    }
}

class PrinterWriter {
    public function write() {
        // valami C alapú feketemágia
    }
}

class FileWriter { // sajna ezt sehol nem tudjuk használni még
    public function write() {
       // még több black magic
    }
}

```

Hát nem egyszerű a helyzet ugye? Megcsináltuk a kis FileWriter osztályunkat, átpasszoltuk a kollégánknak, de az nem tud vele mit kezdeni, <del>maximum egy kis bájtkód manipulációval, amit a javások annyira szeretnek 🙂</del> Viszont nekünk nem állnak rendelkezésünkre ilyen finomságok, így kicsit újra kell gondolnunk az egészet.

<figure aria-describedby="caption-attachment-1183" class="wp-caption aligncenter" id="attachment_1183" style="width: 268px">[![bad design](assets/uploads/2016/07/bad-design.png)](assets/uploads/2016/07/bad-design.png)<figcaption class="wp-caption-text" id="caption-attachment-1183">Az alap felállás</figcaption></figure>

Ha szeretnénk magunkat megkímélni a kedves kollégánk életreszóló haragjától, akkor nem árt bevezetni egy közbenső absztrakciós réteget a magas és alacsonyszintű osztályunk közé. Mivel a komplex logikát a magasszintű osztályok tartalmazzák, ezért nem szabadna, hogy alacsony szintű osztályoktól függjenek.

<figure aria-describedby="caption-attachment-1185" class="wp-caption aligncenter" id="attachment_1185" style="width: 399px">[![still bad design](assets/uploads/2016/07/still-bad-design.png)](assets/uploads/2016/07/still-bad-design.png)<figcaption class="wp-caption-text" id="caption-attachment-1185">Ez még mindig nem az igazi..</figcaption></figure>

Az új réteg szintén gondot okozna, ha ezt is az alacsonyszintű osztályokra építenénk, ezért megfordítjuk a dolgot. Az új absztrakciós rétegre építjuk az alacsonyszintűeket és ezáltal a magasabbszintűeket is (Itt történik az a bizonyos dependency inversion). Na de mi lesz ez az absztrakciós réteg? Hát interfészek, mi más?:)

Akkor jöjjön a megvalósítás kódszinten:

```
<pre data-language="php">interface Reader {
     public function read();
}

interface Writer {
     public function write();
}

class FileReader implements Reader {
   // ...
}

class FileWriter implements Writer {
   // ...
}

class KeyBoardReader implements Reader {
  // ...
}

class PrinterWriter implements Writer {

}

class Copy {
   private $reader, $writer;

   public function __construct(Reader $reader, Writer $writer) {
       $this->reader = $reader;
       $this->writer = $writer;
   }
}

```

A fenti példában kicsit túltoltam, mert plusz megvalósításokat írtam, de remélem jól látható, hogy mostantól mind a konkrét implementációk, mind pedig a magasabbszintű osztályunk az absztrakciós rétegtől, azaz a Reader és Writer interfészektől függ. Ha akarjuk, a Copy osztályunkban szabadon cserélgethetjük az említett interfészek implementációit<del> amíg nem dobálunk NotImplementedExceptiont benne</del>.

<figure aria-describedby="caption-attachment-1184" class="wp-caption aligncenter" id="attachment_1184" style="width: 563px">[![good design](assets/uploads/2016/07/good-design.png)](assets/uploads/2016/07/good-design.png)<figcaption class="wp-caption-text" id="caption-attachment-1184">A konkrét interfészek nélkül</figcaption></figure>

Tehát a célt elértük, ami mi is volt?

- A magas szintű modulok ne függjenek az alacsonyszintű moduloktól, hanem absztrakciókra építsük őket.
- Az absztrakciók ne függjenek a megvalósítástól, hanem a megvalósítás függjön az absztrakcióktól.
- A Copy osztályba nem kell belenyúljunk, ha egy újfajta implementációt adunk hozzá
- Emiatt, hogy nem kell belenyúlni, a régi működést nem fogjuk hazavágni
- Mivel nem módosult a Copy osztály, ezért nem kell újra unit tesztelni azt

Amikor alkalmazzuk ezt az elvet, akkor a magasszintű osztályok nem közvetlenül a megvalósító alacsonyszintű osztályokkal dolgoznak, hanem interfészeket fognak absztrakt rétegként használni. Emiatt, az új alacsonyszintű osztályok példányosítása a magasabbszintű osztályok belsejében a new kulcsszóval nem lehetséges, helyette Factory method, Abstract Factory, stb. létrehozási tervezési mintákat használhatunk e célra. Ahogy már a fenti példában is látszott, ennek az elvnek az alkalmazása plusz időráfordítást igényel, több osztályt, összeségében komplexebb kódbázist, ellenben sokkal flexibilisebb, mert nem égetünk bele megvalósításokat a kódba.

Természetesen ez sem egy aranyszabály, szóval ha van egy olyan osztályunk, amihez a következő évtizedben senki sem <del>mer</del> fog nyúlni, akkor nem szükséges ráerőszakolni ezt a mintát és átírni azt.