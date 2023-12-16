---
id: 1541
title: 'Mit tegyünk ha már elvesztünk a logfájlokban?'
date: '2017-05-11T10:02:33+02:00'
author: tacsiazuma
layout: post
guid: '{{ site.url }}/admin/?p=1541'
permalink: /2017/05/11/mit-tegyunk-ha-mar-elvesztunk-logfajlokban/
dsq_needs_sync:
    - '1'
    - '1'
newsphere-meta-content-alignment:
    - align-content-left
image: 'assets/uploads/2017/05/11003512/Bull-Elk-Bugling.jpg'
categories:
    - Intermediate
    - PHP
tags:
    - context
    - diagnostic
    - log
    - logback
    - mapped
    - mdc
---

Ismert a mondás, hogy a fejlesztők idejük 90%-ában debuggolnak, a másik 10%-ban pedig bugokat írnak. Ez utóbbi egy lokális/remote alkalmazás esetében még a nyelvspecifikus debuggerrel megoldható, lépegethetünk soronként, megnézhetjük hogy mi is történt pontosan egy/egy request/thread mentén. Viszont amikor mindez éles, netán tesztkörnyezetbe került, akkor ez az opció elveszett, így marad az, hogy a hibakeresés szempontjából lényeges információkról logbejegyzéseket hagyunk hátra és reménykedünk hogy sosem kell belenézzünk.[![](assets/uploads/2017/02/Bull-Elk-Bugling.jpg)](assets/uploads/2017/02/Bull-Elk-Bugling.jpg)

Azonban a helyzet sokszor nem ilyen rózsás, hiszen képzeljünk el egy olyan alkalmazást, ami felé másodpercenként lekérések ezrei érkeznek, netán aszinkron hívásokat intézünk benne third party service-ek felé és a hiba konkrét okának visszafejtése egyre nehezebb és nehezebbé válik.

Képzeljük el a következőket egy logfájlban:

```
<user@email.com> logged in
Applying coupon 'please'
Uncaught exception ServiceUnavailableException. Trace: ...
<user2@email.com> logged in
Payment service is down
Applying coupon 'please'
Coupon apply error - Already applied.
```

A fenti logbejegyzések, habár önmagukban megállják a helyüket, ha hibát keresünk, akkor bizony keveredhetnek a dolgok. Kapunk egy olyan hibaticketet például, hogy a felhasználónk, mikor kupont próbált használni a vásárláskor, az nem engedte neki, hanem hibát dobott a rendszer. Megkapjuk a tickettel a felhasználó e-mail címét, ami `user@email.com`. A fentiek alapján még az is lehet, hogy mindkét kupont ő próbálta használni, de az is lehet, hogy csak egyszer próbálta, viszont az is előfordulhat, hogy a hiba nem is nála fordult elő, hanem egy olyan ágba futott a kód, amiről eddig nem tudtunk. Ha dátummal prefixáljuk a dolgot, az talán segíthet, de még az sem tudja feltétlenül megoldani a dolgot, így valami más után kell nézzünk.

A fogalom, amit mi keresünk az ún. `mapped diagnostic context`, röviden MDC lesz. Ez nem jelent mást, mint annyit, hogy a debuggolás szempontjából fontos információkat hozzácsapjuk a logbejegyzésekhez, ezáltal össze tudjuk kapcsolni azokat, az egyenként értelmetlen sorok értelmet nyernek. Ezt úgy fogjuk megcsinálni, hogy az egyes requestek bejövetelekor, még mielőtt bármit is kezdenénk a lekéréssel, a tudtára hozzuk ezeket a loggernek és utána minden logbejegyzésben ott lesz mindez.

Mi lehet lényeges információ ilyenkor?

- session ID
- user ID / email cím
- ha load balancer mögött vagyunk, akkor az instance ID-ja
- és még sok más, ami domaintől függően segíthet

Na és hogy tudjuk ezeket ügyesen használni?

A józanul íródott logger librarykben már jelen vannak olyan helperek, amik segítenek nekünk abban, hogy requestenként beállítsuk a megadott MDC változókat, de a sokszor használt monolog-ban ez nem így van, így aki szeretne ilyesmit, annak egy kis mágiához kell folyamodni [innen](https://github.com/szjani/lf4php). Mi viszont a Javából már jól ismert log4j PHP-s párját, a [log4php](http://logging.apache.org/log4php/)-t fogjuk használni most. Húzzuk is le a `composer` segítségével!

```
composer require apache/log4php:^2.3
```

Vagy kézzel adjuk hozzá azt a JSON-höz:

```
"require": {
    "apache/log4php" : "2.3"
},
```

Ezután a rendelkezésünkre is áll minden függőség, amire szükségünk van.

Nem fogunk most keretrendszer specifikusan belemenni a dolgokba, legyen elég annyi, hogy lévén itt nem kell attól félnünk, hogy két requestet szolgálna ki egy logger, ezért annyi a dolgunk, hogy azokat az információkat, amik segítségünkre lehetnek a hibakeresésben, minél előbb beállítjuk. Ez pl. egy Laravel esetében `before``middleware`-be kerülne, hogy még a controller dolgai előtt beállítsuk az értéket, hogy utána már a logolás a beállított értékkel történjen. A kód, amit mi használni fogunk, nagyon egyszerű, kb. egy szimpla `index.php`:

```
<?php

require_once "vendor/autoload.php";

Logger::configure("logger.php");

LoggerMDC::put("guid", "dc7bd828-6bdb-4075-85dd-f1e8de037f8e");
$logger = Logger::getLogger("main");

$logger->info("This is what happens when you got MDC");
```

Semmi nem történt, csak behúztuk a composer autoloaderét, utána felkonfiguráltuk a Loggert. Ezután beállítottunk egy MDC-t, mégpedig `guid` névvel. Tegyük fel, hogy ilyen GUID azonosítókkal látjuk el az egyes usereket. Emellé bekerülhet egy` session id` is, amivel már azt is tudjuk figyelni, hogy az adott user esetleg két böngészővel betyárkodik egyszerre, de most csak röviden. Ezután kikérjük a loggert egy factory-ból, aminek átadjuk a Loggerünk nevét. Ezt általában az adott osztályra szokták szabni, tehát

```
$logger = Logger::getLogger(__CLASS__);
```

a megfelelő módja, ha osztályokban használjuk. A `logger.php` tartalma pedig:

```
return array(
    'appenders' => array(
        'default' => array(
            'class' => 'LoggerAppenderFile',
            'layout' => array(
                'class' => 'LoggerLayoutPattern',
                'params' => array(
                    'conversionPattern' => '%date [%logger] [%-5level] [%mdc{guid}] %msg%n'
                )
            ),
            'params' => array(
                'file' => 'file.log',
                'append' => true
            ),
        ),
    ),
    'rootLogger' => array(
        'appenders' => array('default'),
    )
);
```

Az apache loggere úgy működik, hogy több úgynevezett `logger appender`-t is megadhatunk, ezáltal több dolgot többféleképpen is tudunk logolni. Mi itt most csak egy ilyen appendert akarunk, ami fájlba fog logolni. Ezután megadjuk neki, hogy milyen sémát kövessenek az egyes logbejegyzések. Nekünk most egy dátum, utána a logger neve (`__CLASS__` esetén az osztály neve), utána a log szintje, ezután pedig a guid MDC értéke és legvégül az üzenet, amit logolunk. Egy logbejegyzés a fenti kódot lefuttatva az alábbi módon fest:

```
2017-05-06T21:12:13+02:00 [main] [INFO ] [dc7bd828-6bdb-4075-85dd-f1e8de037f8e] This is what happens when you got MDC
```

Az összes ezt követő logbejegyzés tartalmazni fogja ezt a bejegyzést, egészen az adott HTTP request végéig, hacsak explicit, ki nem vesszük azt a

```
LoggerMDC::remove("guid");
```

A következő részben megnézzük, hogy tudjuk mindezen működést alkalmazni Symfony 3/Laravel 5 alatt, valamint megnézzük a kapott logokban való keresgélést Splunk segítségével! Sorra veszünk pár trükköt is, hogy pl. a production/staging environmentben ne hányjuk tele terabájtokkal a logokat, hanem mindezt adott sessionhöz kössük és még egyéb finomságokat!