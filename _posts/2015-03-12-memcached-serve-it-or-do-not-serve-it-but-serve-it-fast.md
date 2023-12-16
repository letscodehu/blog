---
id: 388
title: 'Memcached &#8211; Serve it or do not serve it, but serve it fast'
date: '2015-03-12T08:45:07+01:00'
author: tacsiazuma
layout: post
guid: '{{ site.url }}/?p=388'
permalink: /2015/03/12/memcached-serve-it-or-do-not-serve-it-but-serve-it-fast/
dsq_thread_id:
    - '3588465848'
    - '3588465848'
categories:
    - PHP
tags:
    - cache
    - key
    - memcache
    - memcached
    - php
    - server
    - value
---

Amikor az ember rákeres a PHP és cache szavakra, óhatatlan, hogy rábukkanjon az apc/memcache/memcached szócskára (kéretik nem összetéveszteni). Mi most ez utóbbit fogjuk a műtőasztalra emelni, a legkedvesebb rendszergazda ismerősünkkel.

##### Mi is az a memcached?![ram](assets/uploads/2015/03/ram-1024x683.jpg)

A memcached egy [<del>összeomlás szélén álló vérnyúlpopuláció</del> ](http://memcached.org/images/memcached_banner75.jpg)key-value szerver, tehát php szemmel úgy képzeljük el, mint egy jókora asszociatív tömböt. A legfőbb különbség, hogy ez nem a mi php alkalmazásunk memóriájában van, hanem egy linux serveren fut egy memcached nevű service, amit mi egy erre kitalált osztályon/kiterjesztésen keresztül érünk el.  
Miért kell a külön service? Mint tudjuk, a php addig fut, amíg a lekérés és nem tovább, két munkamenet között az adatok átadása véges, na meg ha a cacheben 1 gigabájt információt tárolunk, és ugyanezt terveznénk PHP-ben, akkor pár egyidejű lekérés és a serverünk be<del>kernel</del>pánikol, a rendszergazdánk pedig előveszi a legpusztítóbb tekintetét.

Ahhoz, hogy mindenki jól járjon és <del>felesleges programokkal spammeljük tele az oprendszerünket,</del> és kipróbáljuk, mindenek előtt fel kellene ezt lőjük. A szegény windows user-eket el kell keserítsem, ők max távolról (értsd: virtualbox) nézhetik a dolgot, mert a memcached egyelőre csak <del>all hail</del> linuxra van.

[Package](https://code.google.com/p/memcached/wiki/NewInstallFromPackage#Ubuntu_&_Debian)-ként is leszedhetjük, de aki esküszik a hardmode-ra, annak egy tarball-t kell letöltenie, kicsomagulnia, lefordítani és telepíteni:

```
<pre data-language="shell">wget http://memcached.org/latest
tar -zxvf memcached-1.x.x.tar.gz
cd memcached-1.x.x
./configure && make && make test && sudo make install
```

Ez a program, bármily meglepő C-ben íródott, ezért majd legyünk résen a dependenciák ügyében (pl. libevent), de ha sikerült feltelepíteni, akkor alapesetben a kis gonosz már fel is lövi magát és még az init.d-ben is ott találjuk, szolid 64 megát használva. Ha mi indítjuk el, akkor többféle argumentumot elfogad, a -h paraméterrel kicsalhatjuk azokat. A legfontosabb, a

-m Az általa használt memóriát tudjuk ezzel szabályozni, megabájtban mérve

-d Ha parancssorból indítjuk el és nem init.d által, akkor ezzel tudjuk service-ként futtatni.

-p A port, amin csücsül az éppen létrehozott példányunk (TCP, az UDP portot az -U kapcsolóval tudjuk átállítani!). Ha több példányt futtatunk egy adott szerveren, akkor ezáltal tudjuk elkerülni az ütközéseket.

Usereket rendelhetünk hozzá és még sok mást tehetünk, de nem szeretnék nagyon belemenni a részletekbe.

Tegyük fel, hogy feltettük, működik a service, telnettel ki is próbálgathatjuk, ha beszéljük a protokoll nyelvét 🙂

Jöjjön a PHP, ez sem lesz sokkal bonyolultabb:

Akinek fent van a PECL kiterjesztés, az a

```
<pre data-language="shell">sudo pecl install memcached
```

-el tudja feltenni, de többféle módon telepíthető, itt is vigyázni kell a dependenciákra, mert könnyen cs\*csre futhatunk.

Ha minden jól ment, akkor egy apache restartot követően a phpinfo() kidobja, hogy bizony fent van a kiterjesztés.

##### Tessenek vigyázni, az ajtók záródnak

Most, hogy működik PHP oldalon és a háttérben is fut, ideje összeheftelni a dolgot, hogy valami hasznát is vegyük annak a lefoglalt memóriának. Tegyük fel, hogy a gépünkön autentikusan elindítottunk 3 példányt, amik különböző portokon futnak:

```

$m = new Memcached(); // bamm, példányosítottuk! ezzel sajna még sokra nem megyünk
```

```
$m->addServer('localhost', 11111, 1);
$m->addServer('localhost', 11112, 2);
$m->addServer('localhost', 11113, 3);
```

Létezik ugyan erre egy stílusosabb megoldás, mivel egyszerre egy tömböt is elfogad, de így jobban tudom szemléltetni a dolgot. Az első paraméter maga a host, a második a port, a harmadik pedig egy ún. súly. Ez a súly dönti el, hogy a hozzáadott szerverek közül mekkora eséllyel lesz ez a szerver kiválasztva.

> Kiválasztva?? Nem azért adok hozzá három szervert, hogyha az egyik lehal, akkor a másik kettőn ott legyen az infó, mint valami tükrözött HDD-n?

A válaszom: nein! Ha a memória olyan olcsó lenne, mint a winchester, akkor valóban hozzáadhatnánk háromszor is annyit, viszont jelen esetben nem tehetjük meg, hogy x bájt adat 3x bájtnyi memóriát foglaljon el, de ne kanyarodjunk el a megvalósítástól, akkor majd minden megvilágosodik.

Adjunk hozzá valami kulcsot!

```
<pre data-language="php">$ttl = 666; // so hardcore
$m->set('ezIttegyBeszedesKulcs', $valamiGyakranHasznaltAdat, $ttl);
```

Bumm, hozzá is adtuk. A TTL egy másodpercet jelöl, ameddig az adott kulcs él, tehát utána hiába van ott a kulcs, az már elavultnak minősül, így ha 666 másodperccel később a következő parancsot adjuk ki:

```
<pre data-language="php">$valamiGyakranHasznaltAdat = $m->get('ezIttegyBeszedesKulcs');
```

Akkor bizony a változónk értéke nem az lesz, amit szeretnénk, hanem false. Ennélfogva true és false értéket tárolni cache-ben nem épp ideális (arról nem is beszélve, hogy boolean értéket úgy egyáltalán nem lenne érdemes itt tárolni).

A memcache példányain állapotát egy

```
<pre class="prettyprint" data-language="shell"><span class="pln">echo </span><span class="str">"stats settings"</span> <span class="pun">|</span><span class="pln"> nc <host> <port></span>
```

paranccsal tudjuk lekérdezni.

A memcached témakörről úgy hirtelen ennyit, aki többet szeretne erről olvasni, az nyugodtan kérdezzen/kérjen, aki pedig türelmetlen, annak a dokumentáció [itt](http://php.net/manual/en/class.memcached.php) található.