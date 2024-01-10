---
id: 736
title: 'Command Pattern és a pénzügy/számvitel'
date: '2015-08-30T21:33:47+02:00'
author: tacsiazuma
layout: post
guid: '{{ site.url }}/?p=736'
permalink: /2015/08/30/command-pattern-es-a-penzugyszamvitel/
dsq_thread_id:
    - '4081798081'
    - '4081798081'
categories:
    - Intermediate
    - PHP
tags:
    - command
    - pattern
    - php
---

Most, hogy a mai napi <del>orbitális szívás</del> programozási kihívásokon túlestem, ideje megosztani az infót<del> valami másról, hogy mások is szívjanak annyit, mint én</del>.

<figure aria-describedby="caption-attachment-737" class="wp-caption aligncenter" id="attachment_737" style="width: 640px">[![raf_fighter_command](assets/uploads/2015/08/raf_fighter_command.jpg)](assets/uploads/2015/08/raf_fighter_command.jpg)<figcaption class="wp-caption-text" id="caption-attachment-737">"Nézd csak, oda kéne egy swipe-olható lightbox-os slider. Te programozó vagy, neked az öt perc!" - Ügyfél</figcaption></figure>

A Command tervezési minta egy az adat-vezérelt minták közül és viselkedési minták közé tartozik. Lényege annyi, hogy a kérés egy objektumba van csomagolva, ilyen formában kerül átadásra az ún. invoker objektum karmai közé. Az utána megkeresi az illetékes ojjektumot ami képes ennek a "parancsnak" a teljesítésére és átadja annak, ami ezek után jó katonához híven teljesíti is azt.

Akkor most nézzük meg, hogy is lehet outsource-olni a problémát egy másik fejlesztőnek? Ha már annyit beszélgettünk megrendelésekről Martin papával, akkor most ismét legyen ez a téma.

Tegyük fel, hogy tőzsdézünk. Ennélfogva eladni/venni fogunk, viszont mindkettő egy "megrendelés" lesz. Ennélfogva azokat valamilan módon ebből az osztályból kellene származtatni. Sőt! Mivel a fenti kettő megvalósításának logikája nagyban eltér egymástól (no meg interfészt fogunk typehintelni), ezért interfészként fogjuk definiálni.![Philippine-stock-market-board](assets/uploads/2015/08/Philippine-stock-market-board.jpg)

\[tabs type="horizontal"\]\[tabs\_head\]\[tab\_title\]PHP\[/tab\_title\]\[/tabs\_head\]\[tab\]

```
<?php

interface Order { // a jól szituált megrendelés interfész

public function execute(); // lesz egy végrehajtás metódusa minden megrendelésnek

}
```

\[/tab\]\[/tabs\]

Ez lesz a Command pattern-ünk interfésze, viszont nem ártana meg is valósítani mindezt, mint a levegőbe beszélni, nemde? Ahhoz, hogy bármilyen részvényt megvegyünk, nem ártana maga a részvény, nemde? Hozzuk létre ezt, valamint az eladás/vétel "parancsait":

\[tabs type="horizontal"\]\[tabs\_head\]\[tab\_title\]PHP\[/tab\_title\]\[/tabs\_head\]\[tab\]

```
<?php

class Stock { // a részvényünk, a'la value object. Ezt fogjuk type hintelni, hiszen nem lehet csak úgy mindenféle részvényt megvenni!

    private $name = "Letscode"; // nem ártana vállalkozási formát váltanom...
    private $quantity = 10; // 10 részvényt kezelünk

    public function buy() { 
       echo $quantity. " darab ". $name . " részvényt megvettek.";
    }
    public function sell() { // legyen valami bizonyíték is, nemde
       echo $quantity. " darab ". $name . " részvényt eladtak.";
    }

}



class BuyStock implements Order { // ezzel tudjuk majd jól megvenni a részvényeket
 private $stock; // a részvényünket itt tároljuk

  public function __construct(Stock $stock) {
    $this->stock = $stock; // átadjuk neki a konstruktorban a részvényt, amire vonatkozik
  }
  public function execute() { // az interfész megkötése
    $this->stock->buy(); // a parancs végrehajtásakor megvesszük a részvényt
  }

}

class SellStock implements Order { // ezzel tudjuk majd jól eladni a részvényeket
 private $stock; // a részvényünket itt tároljuk

  public function __construct(Stock $stock) {
    $this->stock = $stock; // átadjuk neki a konstruktorban a részvényt, amire vonatkozik
  }
  public function execute() { // az interfész megkötése
    $this->stock->sell(); // a parancs végrehajtásakor eladjuk a részvényt
  }

}
```

\[/tab\]\[/tabs\]

[![broker](assets/uploads/2015/08/broker.jpg)](assets/uploads/2015/08/broker.jpg)Most, hogy megvan a részvény, megvan a parancs rá, hogy vegyél,<del> igyál,</del> eladj, nem ártana megkreálni a kis droidot, aki teljesíti a kis parancsainkat!

\[tabs type="horizontal"\]\[tabs\_head\]\[tab\_title\]PHP\[/tab\_title\]\[/tabs\_head\]\[tab\]

```
<?php
class Broker { // a mi kis brókerünk, aki éhbérért az egekig röpít minket

    private $orderList = array(); // a megrendeléseket tartalmazó tömb
    public function takeOrder(Order $order) { // itt tudunk neki parancsokat adni
        $this->orderList[] = $order; // amiket beleoktrojál a tömbbe
    }

    public function placeOrders() { // itt pedig elvégzi a feladatot amiért fizetjük
       foreach ($this->orderList as $order) { // végigmegyünk az ordereken
           $order->execute(); // nem tudjuk, hogy az vétel/adás, viszont azt tudjuk, hogy mivel az Order interfészt implementálta, ezért végrehajtható
       }
       $this->orderList = array(); // kiűrítjük a listánkat 

    }
}
// na akkor nézzük hogy is tudjuk munkára fogni a kis minion-unkat!
 $stock = new Stock(); // egy jóféle letscode részvény!
 $broker = new Broker(); // felveszünk egy új brókert
 $broker->takeOrder(new BuyStock($stock)); // adunk neki egy parancsot, miszerint vegyen egy ilyen részvényt
 $broker->takeOrder(new SellStock($stock)); // majd eladunk egy ilyet
 // megjegyzés: a fentiek még nem kerültek végrehajtásra, szóval ha időközben lelövik a brókerünket, akkor nem vesz semmit
 $broker->placeOrders(); // megmondjuk neki, hogy most rögtön végezze el a feladatot
```

\[/tab\]\[/tabs\]

A command pattern igen egyszerű minta, mint láthatjuk és ezért nem egy nagy ördöngősség elsajátítani. Segítségével a parancsokat egy végrehajtási sorba tehetjük, megjegyezhetjük azok végrehajtását, visszamondhatjuk, stb. Elválaszthatjuk az objektumot ami kéri az adott feladatot attól ami konkrétan elvégzi és a kettő között egy jól átjárható interfészt hozhatunk létre.
