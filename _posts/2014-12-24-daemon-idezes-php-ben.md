---
id: 37
title: 'Daemon idézés PHP-ben'
date: '2014-12-24T14:13:19+01:00'
author: tacsiazuma
layout: post
guid: 'http://iacwebshop.hu/?p=37'
permalink: /2014/12/24/daemon-idezes-php-ben/
dsq_thread_id:
    - '3356298985'
    - '3356298985'
categories:
    - Advanced
    - PHP
tags:
    - daemon
    - fork
    - linux
    - pcntl
    - php
    - process
---

A daemon, <del>a mitológiákban az istenek és az emberek között állnak és </del> a multitask rendszerekben használatos elnevezés azokra a programokra, amik a háttérben futnak, ahelyett, hogy direkt kapcsolatban lennének a felhasználóval.

Ilyen daemon például az `sshd` is, ami az SSH protokollt felügyeli a háttérben. Na de hogy jön ide a PHP, amit a legtöbben egy szerveroldali szkriptnyelvként ismernek, dinamikus weblapok készítésére? Nos, a PHP nem csak a böngészőben futhat, hanem telepíthető parancssori alkalmazások futtatására is. Ez azonban még mindig nem daemon, hiszen elindítjuk, lefut és visszakapjuk a parancssort, tehát nem a háttérben fut.

#### Forkolás

A forkolás az a folyamat, amikor egy process-t lemásolunk. Külön process ID-t (PID) kap és a háttérben fut tovább. Ez a process lesz a daemon. A másik pedig az eredeti process, ami daemon-ok esetében igen hamar véget ér és vissza is kapjuk az villogó kurzorunkat. Ahhoz, hogy ezt PHP-ben elérjük, ahhoz szükségünk lesz a pcntl kiterjesztésre, így ha mi fordítjuk/konfiguráljuk a PHP-t, akkor az `--enable-pcntl` kapcsolóval tegyük azt. Az XAMPP és LAMPP stackek alapból tartalmazzák ezt.

#### Pcntl\_fork()

A `pcntl_fork()` függvény az épp futó folyamatot klónozza le. Miután kettéválasztottuk, mindkét folyamat fut tovább. Tehát az alábbi egyszerű programot futtatva

```
<?php
$pid = pcntl_fork();

if ($pid == -1 ) {
exit("Oops, something messed up our summoning circle!");
}
if ($pid != 0) {
exit ("Congratulations! You summoned a daemon with PID = ". $pid);
} 
else {
      while (true) {
             sleep(1);
      }
}
?>
```

Mit is csinál a fenti script? A `pcntl_fork() ` függvény integert ad vissza, ami háromféle értéket vehet fel. -1 értékkel tér vissza, ha valami hiba csúszott a műveletbe. 0 értékkel tér vissza a forkolt "gyermek" process esetében, és a forkolt gyermek PID-jének értékével tér vissza a "szülő" process esetében. Ez a PID még később hasznos lehet. De térjünk vissza a példánkhoz. Leforkoljuk a folyamatot, aztán megnézzük, hogy a sikeres volt-e a művelet. Ha nem, akkor kilépünk és tudatjuk a userrel, hogy valami hiba csúszott a műveletbe. Ha sikerült, akkor kiírjuk az adott szöveget és tudatjuk, hogy mi is a daemon-unk PID-je. Ha pedig 0-át kaptunk vissza értékül, akkor a daemonról van szó, ezért egy szimpla while ciklussal életben tartjuk (ne felejtsük el a sleep parancsot beilleszteni, mert anélkül komoly erőforrásokat használhat a program a háttérben).

A while cikluson bármit elhelyezhetünk, de vegyük figyelembe, hogy háttérben futunk, így output-ot ne produkáljunk.

#### Kill (it with fire!)

Nos ez mind szép és jó, de mi van akkor, ha ki akarunk lépni a programból?

Mivel Linux alatt ténykedünk (ugye? 🙂 ), a `kill` parancs lehet a segítségünkre. Ellenben a gondunk az, hogy a programunknak nem adtunk instrukciókat arról, hogy mit is tegyen, ha 9 (SIGKILL), netán 15 (SIGTERM) signált kap. Itt jön jól a `pcntl_signal()` függvény, amivel signal handler függvényeket tudunk megadni. Ezzel elérhetjük, hogy a félbehagyott folyamatokat még befejezzük, elmentsük az ideiglenes fájlokat, kilépjünk fájlokból, mielőtt a programunkat lelőnénk.

Ellenben a kill parancs nem éppen elegáns megoldás erre, még ha felírtuk is valahova a PID- vagy ps parancssal kikerestük a listából. Erre használ a legtöbb linux alatt futó daemon egy ún. PID file-t, ami nemes egyszerűséggel a háttérben futó daemon process ID-jét tárolja. Aztán amikor beírjuk, hogy `sudo apachectl stop` ,akkor megkeresi ezt a PID fájlt, és az adott PID-re küldi a kill signalt. Ha pedig nem találja a fájlt, akkor kiírja, hogy "apache is not running (no pid)".

A folytatásban példákkal bemutatom, hogy is kell hozzá start/stopscriptet csinálni és mire is lehet ezt használni.
