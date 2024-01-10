---
id: 176
title: 'Factory Pattern &#8211; A munkának vége, kijössz a&#8230;'
date: '2015-01-24T19:20:43+01:00'
author: tacsiazuma
layout: post
guid: '{{ site.url }}/?p=176'
permalink: /2015/01/24/factory-pattern-munkanak-vege-kijossz/
dsq_thread_id:
    - '3451973426'
    - '3451973426'
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
    - design
    - factory
    - oop
    - pattern
    - php
---

A tervezési mintákkal foglalkozó sorozatunk második részéhez értünk, ahol az objektumainkat bizony egy gyártósor fogja ontani magából.

A *factory pattern* az egyik leggyakrabban használt minták közé tartozik, típusát tekintve a létrehozási minták közé soroljuk.[![1024px-Garland_Sugar_Factory_-_Utah-Idaho_Sugar_Company_-_general_view_-_Garland_Utah](assets/uploads/2015/01/1024px-Garland_Sugar_Factory_-_Utah-Idaho_Sugar_Company_-_general_view_-_Garland_Utah-1024x727.jpg)](assets/uploads/2015/01/1024px-Garland_Sugar_Factory_-_Utah-Idaho_Sugar_Company_-_general_view_-_Garland_Utah.jpg)

#### Hogy is működik?

Képzeljük el, hogy bemegyünk egy autószalonba és kiválasztunk egy csinos kis autót. Kiválasztjuk a színét, az extrákat, <del>alávarrjuk a neon-t és haddmenjen!</del> aztán leadjuk a rendelést. A rendelés megérkezik a gyárba, legyártják, mennek vele pár tesztkört és végül kigurul a kapun, aztán a szalon előtt a parkolóban átadják a kulcsot és már roboghatunk is haza.

Akkor most jöjjön a kavarás. A factory ez esetben egy osztály lesz, ami az példánkban a gyárat fogja jelképezni. Mi vagyunk a kliens, egy másik osztály, aki a factory-val egy publikus interfészen (metóduson), mégpedig a csinos eladó nénin keresztül tartja a kapcsolatot a gyárral. Mi csak leadjuk a rendelést, de a konkrét gyártási folyamatról mit sem tudunk (a Hogyan készült? összes epizódja ellenére se 😛 ), ezek lesznek a gyártás során használt privát metódusok. Mi csak leadtuk az igényeket és bumm, megkaptuk az autót (osztálypéldányt), ami az igényeknek megfelelően lett konfigurálva és startra kész.

Na de valami fogalmunk csak van arról, hogy mégis milyen is lehet egy gyártási folyamat,[![1024px-Trabant_601_Mulhouse_FRA_001](assets/uploads/2015/01/1024px-Trabant_601_Mulhouse_FRA_001-300x200.jpg)](assets/uploads/2015/01/1024px-Trabant_601_Mulhouse_FRA_001.jpg) nemde? Akkor nézzük meg azt a szupertitkos belső működést nagy vonalakban.

Az autó, amit legyártunk, megfelel az ISO szabványoknak. Ezek a szabványok leírják, hogy legyen benne fék, tudjunk gyorsítani és a kormány mindkét irányba forgatható legyen. Ez a szabvány egy interfész lesz, amivel lefektetjük a legyártott autónk számára a szabályokat.

```
interface Auto {
    public function fek(); 
    public function gaz();
    public function balra();
    public function jobbra();
}
```

Na, ilyen gyorsan se rágtuk át magunkat ISO szabványokon, nemde? Na de ezzel még nagyon messze vagyunk a céltól. Ugye a gyárunk nem csak egy féle autómárkát/típust gyárthat, ezért mi se erre megyünk rá, csináljunk hát pár autótípust (osztályt), amik elfogadják (implementálják) ezeket a szabályokat (interfészeket).

```
class Lada implements Auto { // igen, komolyan
   // definiáljuk a metódusokat
}

class Trabant implements Auto { // ez pedig még komolyabb
   // definiáljuk a metódusokat
}
```

Na mostmár van két osztályunk, amik közlekedésre alkalmasak, de mivel nem mi gyártjuk le őket, ezért szükségünk lesz a gyárra is.

```
class AutoGyar {
    public function megrendel($autoTipus) { // ugye milyen csinos az értékesítő néni?
         switch($autoTipus) { // a típus alapján példányosítunk osztályt és adjuk vissza azt
             case "TRABANT" :
                      return new Trabant(); // trabantot kértetek, hát megkapjátok!
                      break;
             case "LADA" :
                      return new Lada(); // 20 éves zsigulit mindenkinek!
                      break;
             default : return null;
         }
    }

}
```

Na akkor mi is történik itt? A megrendeles() függvény (amit azért professional környezetben ajánlott átnevezni :D) a mi kis publikus interfészünk. Mivel itt nagyon egyszerű példát használunk, egy szimpla switch-el oldottuk meg a döntést, hogy milyen osztályt példányosítunk. A konstruktoruk se kap semmit, nincs külön konfigurálás, de bőven lehetne még bonyolítani a dolgot.

```
class KedvesVevo { // ezek mi volnánk
    public function __construct() {
       $this->kellEgyVerda();
    }

    public function kellEgyVerda() { // aki nem pest belvárosába járna be vele dolgozni reggel 8-ra az gyakran érezhet így
       $gyar = new AutoGyar();
       $auto = $gyar->megrendeles("TRABANT");
       // megvan az autónk, próbáljuk ki, hogy működik-e
       $auto->gaz();
       $auto->fek();
       $auto->balra();
       $auto->jobbra(); // mivel implementáltuk az ISO szabványokat, ezért az autónk eleget tesz a feltételeknek, lehet menni vele csajozni!
    }
}
```

Nos a fenti példában rendeltünk egy trabantot, az autógyár megkapta a megrendelést, le is gyártotta azt az ISO szabvány (interfész) szerint. Nem tudjuk, hogy csinálta, csak annyit tudunk, hogy ott van a verdánk és hát egy trabanttal meg lehet fordulni, de bizony forddal nem lehet megtrabantulni!
