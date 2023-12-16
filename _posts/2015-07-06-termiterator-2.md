---
id: 556
title: 'Termi(ter)ator 2'
date: '2015-07-06T20:48:09+02:00'
author: tacsiazuma
layout: post
guid: '{{ site.url }}/?p=556'
permalink: /2015/07/06/termiterator-2/
dsq_thread_id:
    - '3911680895'
    - '3911680895'
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
    - Beginner
    - 'Design Pattern'
    - PHP
tags:
    - array
    - design
    - foreach
    - iterator
    - list
    - oop
    - pattern
    - php
---

A mai téma egy roppant egyszerű tervezési minta lesz, amire - ahogy a későbbiekben kiderül - a ![3-31-Lead](assets/uploads/2015/07/3-31-Lead-1024x576.jpg)programnyelveink többségében már példát is találunk. Ha valaha volt már dolgod valamilyen adatbázissal (amit erősen remélek), legyen az mongo vagy épp SQL, akkor nagy az esély, hogy tömbökön másztál végig, mikor a lekérések eredményeit jelenítetted meg/végeztél vele műveletet. A végigjárásra a foreach parancsot használtad, amiről nem is sejtenéd, hogy mennyi köze lesz a mai témához. Ha objektumorientált programozásról van szó, akkor a puszta tömbök szép lassan kezdenek a háttérbe szorulni, hanem az őket elburkoló ún. Iterátorok lépnek előtérbe. De mi is az az iterátor? Az iterátor egy interfész lesz, ami lehetővé teszi, hogy az objektum által elburkolt tömbön lépkedjünk. De nézzük meg miről is van szó:

```
<pre data-language="php">interface Iterator {

     public function current(); // ezzel a metódussal tudjuk kikérni az aktuális elem értékét
     public function key(); // ezzel a metódussal tudjuk kikérni az aktuális elem indexét
     public function next(); // ezzel a metódussal tudunk egyet lépni
     public function rewind(); // ez állítja vissza az aktuális indexet 0-ra.
     public function valid();  // ez pedig visszaadja, hogy az aktuális index létezik-e?

}
```

> Megjegyzés: A fenti interfész megvalósításra került már a PHP 5+ verziókban, mint beépített interfész, így ott ez a lépés kihagyható (remélhetőleg ez mindenkire vonatkozik, akire nem, azok nekifutásból tegyenek ellene)

Most akkor valósítsuk mindezt meg egy konkrét osztályunkban:

```
<pre data-language="php">class Resultset implements Iterator {

    private $array;
    private $index;

    public function __construct(array $array) {
       $this->array = $array; // konstruktoron át megkapja a tömböt, amit elburkolunk
       $this->index = 0;
    }

    public function rewind() {
       $this->index = 0; // az aktuális indexet nullázzuk
    }

    public function key() {
       return $this->index; // visszaadjuk az aktuális indexet
    }

    public function current() {
       return $this->array[$this->index]; // visszaadjük az adott indexen levő értéket
    }

    public function valid() {
       return isset($this->array[$this->index]); // leellenőrízzük, hogy létezik-e az adott index
    }

    public function next() {
       $this->index++; // növeljük az aktuális indexet
    }
}
```

A fenti példában megvalósítottuk az összes metódust, amit az interfészünk megkövetelt, most pedig nézzük meg, hogy mit is csinál, ha kipróbáljuk egy foreach-el a dolgot:

```
<pre data-language="php">$array = array( "ein", "two", "tres");

$iterator = new Resultset($array);

foreach ($array as $key => $value) {
    echo "$key : $value \n"; 
}

// 0 : ein
// 1 : two
// 2 : tres

foreach ($iterator as $key => $value) {
    echo "$key : $value \n";
}

// 0 : ein
// 1 : two
// 2 : tres

```

A fenti kódot elnézve jogos lehet a kérdés: mégis mi értelme ennek, ha tök ugyanaz a kimenete a foreach-nek? Az egyik ok az, hogy objektumokkal szeretnénk dolgozni, de nem szeretnénk elveszíteni egy ilyen kényelmes függvényt, mint amilyen a foreach. Ráadásul ezzel csak kiolvasni tudunk atömbből, beleírni nem, ezért a hozzáférés korlátozott.![iterators-gonna-iterate-small](assets/uploads/2015/07/iterators-gonna-iterate-small.jpg)

A másik ilyen előny lehet az, hogy osztályról lévén szó,továbbörökíthetjük és újabb tulajdonságokkal ruházhatjuk fel azt. Tételezzük fel, hogy szeretnénk lehetőséget biztosítani, hogy kinyerjük az iménti elburkolt tömböt:

```
<pre data-language="php">class ResultsetWithToArray extends Resultset {

     public function toArray() {
          return $this->array;
     }

}

$array = array( 1,2,3);
$resultset = new ResultsetWithToArray($array);

$array2 = $resultset->toArray();

var_dump($array === $array2 ); // bool(true) a két tömb megegyezik
```

Ez még nem egy nagy újdonság, csupán lehetővé teszi, hogy a tömbön változtatásokat hajtsunk végre. De mi lehet még esetleg benne? Tegyük fel, hogy a tömbünk elemeit valamilyen filtereken keresztül szeretnénk a nagyközönség elé tárni. Erre is lehetőségünk adódik, mégpedig roppant egyszerű módon:

```
<pre data-language="php">class ResultsetWithFilters extends Resultset {

     private $filters = array(); // az egyes filtereket tároló tömb
     
     public function current() {
         $value = $this->array[$this->index]; // kikérjük az alapértéket
         foreach ($this->filters as $filter) {
              $value = $callback($value); //
         }
         return $value;
     }

     public function addFilter(callable $filter) {
          $this->filters[] = $filter;
     }
}

$array = array(1,2,3);

$it = new ResultsetWithFilters($array);
$it->addFilter(function($value) {
     return (string) $value; // egy egyszerű anonymous function-t adunk át, ami string-é castolja a kapott értéket. Itt igazából megadhatjuk, hogy egy objektum adott metódusának értékét adjuk vissza (pl. toString(), getValue()), vagy műveleteket hajtsunk végre, netán nem is filtert regisztrálunk, hanem egy eseményt kötünk hozzá. 
});

foreach ($it as $value) {
     var_dump($value); // dumpoljuk ki az értékeket
}

// string(1) "1"
// string(1) "2"
// string(1) "3"
```

Amint láthatjátok, ez egy elég egyszerű, de sok esetben hasznos kis minta, amivel a tömbjeink kezelését tudjuk valamelyest közelebb hozni az objektumorientáltsághoz.