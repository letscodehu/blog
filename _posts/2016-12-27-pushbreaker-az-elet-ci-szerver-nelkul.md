---
id: 1439
title: 'Pushbreaker &#8211; Az élet CI szerver nélkül'
date: '2016-12-27T01:36:02+01:00'
author: tacsiazuma
layout: post
guid: '{{ site.url }}/?p=1439'
permalink: /2016/12/27/pushbreaker-az-elet-ci-szerver-nelkul/
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
enclosure:
    - "assets/uploads/2016/12/sad-trompone.mp3\n135735\naudio/mpeg\n"
    - "assets/uploads/2016/12/sad-trompone.mp3\n135735\naudio/mpeg\n"
newsphere-meta-content-alignment:
    - align-content-left
image: 'assets/uploads/2016/12/09202411/1179364856061.jpg'
categories:
    - PHP
tags:
    - analyze
    - checkstyle
    - commit
    - detector
    - git
    - mess
    - pre-push
    - push
    - pushbreaker
    - test
---

Ha körbenézünk, hogy milyen/mekkora projekteken dolgozunk nap, mint nap (és itt főleg a kisebb projektekre gondolok), akkor számunkra is világos lesz, hogy bizony nem minden projekt érdemli meg azt, hogy pl. [Jenkins](https://jenkins.io/) job-ot rendeljünk hozzá és a [.gitlab.yml](https://about.gitlab.com/gitlab-ci/) fájl is hiánycikk, netán nem is bevált gyakorlat a CI szerver a cégnél, ahol dolgozunk, mert csak KKV-knek szórjuk ki az apróbb oldalakat.

Ami viszont természetesen továbbra is fontos, az az hogy [verziókövetve]({{ site.url }}/2015/02/22/a-git-tegylet/) legyenek ezek a kódbázisok is, betartsunk bizonyos konvenciókat, ha írtunk [teszteket]({{ site.url }}/2015/01/06/unit-test-meg-amit-akartok/), azokat ne törjük össze az egyes commitok során és lehetőleg a [PHP mess detector ](https://phpmd.org/)se akadjon ki fájljaink láttán. Mindezt azért, hogy a kódunk megbízható legyen, mások által átlátható és az esetleges utódunk se fakadjon sírva, ha megnyitja a projektet (ez utóbbit főleg akkor értékeljük majd, ha átvettünk egy rendesen karbantartott kódot a sok legacy borzalom után).

A cikkünkben a git kliensoldali hookjait fogjuk igénybe venni és megnézzük, hogy is tudunk bizonyos teszteket és ellenőrzéseket automatizálni a gépünkön, hogy csak olyan kódot engedjünk ki a kezünk közül, amihez<del> jó esetben</del> bátran adjuk a nevünket is<del> a commit authorban</del>.[![](assets/uploads/2016/12/1179364856061-253x300.jpg)](assets/uploads/2016/12/1179364856061.jpg)

Korábban már volt szó arról, hogy pontosan mik is ezek a git hook-ok, így akinek ez nem tiszta, az [itt]({{ site.url }}/2015/08/18/gittegylet-4-jegyeket-berleteket/) utánajárhat. Mi most az ún. pre-push hookra fogunk koncentrálni, ami - nevéből is kiderül -, a push folyamat előtt fog futni és meg tudja azt akadályozni. PHP példákkal fogok dolgozni, de igazából bármilyen nyelvre rá lehet ezeket illeszteni, ahol lehetőségünk van command line meghívni a szükséges teszteket/checkstyle-t, stb.

Azt már tudjuk, hogy ezek az ún. `.git/hooks` mappában tanyáznak, amivel a legfőbb problémánk, hogy a Git mappája nincs verziókövetve, tehát ezeket a fájlokat nekünk kell kézzel bemásolni oda. Bevált szokás, hogy a projektben létrehozunk egy ún. support mappát, amibe pakoljuk a doksikat, hooks fájlokat, konfigokat, stb. Így mi is így teszünk majd.

Először is hozzunk létre egy üres repository-t valahol:

```
git init
```

Ezután hozzuk létre az alábbi szerkezetet:

```
-- src
-- test
-- support
  -- git
```

A` support/git` mappában hozzunk létre egy `pre-push` nevű fájlt, egyelőre az alábbi tartalommal:

```
#! /bin/bash

function header {
    echo "Letscode.hu combo-breaker"
}

header
exit 0
```

A hook egyelőre csak kiír egy sort és utána továbbengedi a futást, de mi csak azt akarjuk egyelőre látni, hogy működik-e.

Viszont a gond az az, hogy ez most nem jó helyen van, hiszen nekünk a `.git/hooks` mappába kellene ezt helyezni. Mivel a PHP projektek 99%-a használ composert, ezért mi ott is beiktatunk egy hookot, mégpedig az install után fogjuk megtenni mindezt. Hozzunk hát létre egy `composer.json`-t:

```
{
    "name": "letscodehu/combobreaker-dummy",
    "description": "Letscode.hu Combobreaker dummy",
    "type": "project",
    "homepage": "{{ site.url }}",
    "require-dev": {
      "phpunit/phpunit": "^4.8",
      "squizlabs/php_codesniffer": "^2.3",
      "phpmd/phpmd": "@stable"
    },
    "autoload": {
        "psr-4": {
            "App\\": "src/App/"
        }
    },
    "autoload-dev": {
        "psr-4": {
            "AppTest\\": "test/AppTest/"
        }
    },
    "scripts": {
        "post-install-cmd" : "cp support/git/pre-push .git/hooks/pre-push && chmod +x .git/hooks/pre-push"
    }
}
```

Akkor nézzük csak meg mi történik itt? Először is behúzzuk a lényeges függőségeket, phpunitot, codesniffert, mess detectort. Az autoloadert bekonfigoljuk, valamint a lényeg: amikor a `composer install`-t futtatjuk, utána bemásolja a support mappából a `pre-push` hookot a helyére és futtathatóvá teszi azt. Ezután, ha futtatunk egy `composer install`-t, láthatjuk is, hogy lefutott a parancs, tehát a fájl a helyére került, nem kell amiatt aggódni, hogy elfelejtjük odamásolni.

Az első lépés megvan, most magát a pushbreakert kellene tesztelni. Adjunk hozzá egy remote-ot saját szájízünk szerint:

```
git remote add origin <repository-url>
```

Ezután pedig próbáljunk egyet pusholni oda:

```
git push -u origin master
```

Láthatjuk, hogy lefutott, mikor kiírja:

```
Letscode.hu combo-breaker
```

Viszont ezzel még sokra nem mentünk, jöjjenek a konkrét lépések, először is vezessünk be egy tesztet. Ahhoz, hogy ez menjen, először is kell egy `phpunit.xml`:

```
<?xml version="1.0" encoding="UTF-8"?>
<phpunit xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:noNamespaceSchemaLocation="vendor/phpunit/phpunit/phpunit.xsd"
         bootstrap="vendor/autoload.php"
         colors="true">
    <testsuites>
        <testsuite name="App\\Tests">
            <directory>./test</directory>
        </testsuite>
    </testsuites>

    <filter>
        <whitelist>
            <directory suffix=".php">./src</directory>
        </whitelist>
    </filter>
</phpunit>
```

Roppant egyszerű, a composer autoloaderét haszáljuk és a test mappából futtatjuk a teszteket. Ha ez megvolt, akkor az eddigi kódot kiegészítjük a `pre-push` fájlban:

```
#! /bin/bash

function header {
    echo "Letscode.hu combo-breaker"
}

function test {
 echo -e 'Running tests...\c'
 vendor/phpunit/phpunit/phpunit > /dev/null
 check $?
}
```

```
function check {
    if [ $1 == 0 ]; then
        pass
    else
        failed
    fi
}

function pass {
    echo -e "\e[32mpassed!\e[0m\n"
}

function failed {
    echo -e "\e[31mfailed!\e[0m\n"
    exit 1
}

header
test
exit 0
```

Na de már megint mi történik itt? Először is meghívjuk a header functiont, utána pedig a test-et. A testben kiírunk egy sort, amit nem zárunk le, elindítjuk a phpunit-ot, annak kimenetére nem vagyunk kiváncsiak ( `> /dev/null`), csak az exit code-jára (`$?`), amit átadunk a check functionnek (`check $?`). A check megkapja ezt a paramétert (`$1`) és onnan állapítjuk meg, hogy hibára futottak-e a tesztek, hogy az exit code 0-tól eltérő-e (`if [ $1 == 0 ]`). Ha hibára futott, akkor a failed function lesz meghívva, ami miután pirossal (`\e[31m`) kiírta, hogy failed, kilép mégpedig 1-es exit code-al (`exit 1`), ami megállítja a push folyamatát. Ha 0-val végződtek a tesztek, akkor a `pass` function lesz meghívva, ami csak befejezi a "running tests..." sort és utána továbbengedi a program futását.[![](assets/uploads/2016/12/CeZu1YjUsAEfhcP-780x1024.jpg)](assets/uploads/2016/12/CeZu1YjUsAEfhcP.jpg)

Ahhoz, hogy ezt tudjuk tesztelni, vegyünk fel egy-egy egyszerű tesztet és tesztelendő osztályt:

`src/App/Dummy.php`:

```
<?php

namespace App;


class Dummy {

    public function comboBreaker() {
        return "c-c-c-combo breaker";
    }

}
```

A hozzá tartozó teszt pedig:

`test/AppTest/DummyTest.php`:

```
<?php

namespace AppTest;


use App\Dummy;

class DummyTest extends \PHPUnit_Framework_TestCase {

    /**
     * @var Dummy
     */
    private $underTest;

    public function setUp() {
        $this->underTest = new Dummy();
    }

    /**
     * @test
     */
    public function it_returns_string() {
        // GIVEN
        // WHEN
        $actual = $this->underTest->comboBreaker();
        // THEN
        $this->assertEquals("c-c-c-combo breaker", $actual);
    }

}
```

A kód egyébként megtalálható [itt](https://github.com/letscodehu/combobreaker). Akkor most próbáljunk pusholni egyet!

```
Letscode.hu combo-breaker
Running tests...passed!

Counting objects: 15, done.
Delta compression using up to 4 threads.
Compressing objects: 100% (8/8), done.
Writing objects: 100% (15/15), 8.01 KiB | 0 bytes/s, done.
```

Siker! Akkor jöjjenek a következő lépések. Nem csak az a lényeg, hogy a tesztjeink lefutottak-e, hiszen a kódminőség soktényezős, ezért nézzük, hogy betartottuk-e a szabályokat, kódunk konzisztens-e és tiszta.[![](assets/uploads/2016/12/uselesscodequalitymetrics-780x1024.png)](assets/uploads/2016/12/uselesscodequalitymetrics.png)

Toldjuk meg a pushbreakert egy plusz metódussal, ez lesz a checkstyle:

```
function checkstyle {
    echo -e 'Running codesniffer...\c'
    vendor/squizlabs/php_codesniffer/scripts/phpcs src --standard=PSR2 > /dev/null
    check $?
}

header
checkstyle
test
exit 0
```

A művelet hasonló, mint a tesztek esetén, ráengedjük az src mappára és várjuk, hogy volt-e valami hiba. A CodeSniffernek [itt](https://github.com/squizlabs/PHP_CodeSniffer/wiki/Configuration-Options) járhattok utána, mert mindenkinek más és más beállítások kellenek, rengeteg szabály van, amik közül válogathatunk, mi jelenleg a PSR2 által megszabott coding standard szerint vizsgáljuk a kódot.

A következő lépés a PHP mess detector lesz:

```
function mess_detector {
    echo -e 'Running mess detector...\c'
    vendor/phpmd/phpmd/src/bin/phpmd src text cleancode,naming,controversial,design --suffixes php,phtml  > /dev/null
    check $?
}
```

```
header
checkstyle
mess_detector
test
exit 0
```

A mess detectornál egy kivételével az összes előre definiált ruelesetet ráengedjük, az `src` mappában levő `.php` és `.phtml` kiterjesztésű fájlokra, és a korábbiakhoz hasonlóan a kimenettől függően szakítjuk meg a push folyamatát.[![](assets/uploads/2016/12/43317546.jpg)](assets/uploads/2016/12/43317546.jpg)

Na mostmár elvileg azt hihetnénk, hogy minden szép és jó, viszont egy probléma még hátravan, aminek az oka a git működésében keresendő.

Tegyük fel, hogy a pushbreakerünk megfog egy hibát, majd azt gyors kijavítjuk, de nem commitoljuk be, hanem egyből újrapusholjuk azt. Bizony, a pushbreakerünk ezt szó nélkül jóváhagyja, ugyanis ő annyit lát, hogy a working directoryban levő kódban ki lett javítva, nem azt figyeli, hogy a pushal milyen kód is megy fel. Kétféle megoldás létezik arra, hogy a valóban repository-ba becheckolt kódot vizsgáljuk:

Az egyik, hogy kicheckoutoljuk egy build directory-ba, amit minden pre-push előtt/után kitakarítunk. Ezzel a gond az, hogy egy nagyobb projekt esetén ez némileg lassítja a dolgot, valamint lehet csak a script sokadik lépése során derül ki, hogy a hibát mégsem javítottuk ki és akkor vissza a kódhoz, gyors commit, utána újra.

A másik módszer az lesz, hogy megvizsgáljuk, hogy valóban mindent becommitoltunk/elstasheltünk-e és a working directory megegyezik azzal, ami felkerül. Ez utóbbit fogjuk most alkalmazni a példában:

```
function git_checker {
    echo -e 'Checking working directory...\c'
    if [ -n "$(git status --porcelain)" ]; then
      echo -e "\e[31mplease commit/stash your changes first!\e[0m\n"
      exit 1
    else
      echo -e "\e[32mclean!\e[0m\n"
    fi
}

header
git_checker
checkstyle
mess_detector
test
exit 0
```

A tesztek lefutása előtt megvizsgáljuk a` git status` paranccsal, hogy van-e olyan változás a working directory-ban, ami nincs becommitolva és ha van, akkor megállítjuk a folyamatot, ha nincs, akkor minden mehet tovább. Ha esetleg szeretnénk még megalázóbbá tenni a hibákat, akkor feltelepíthetjük az `mplayer` csomagot:

```
sudo apt-get install mplayer
```

Ezután kiegészíthetjük a következő sorral a fail function-t:

```
mplayer support/git/sad-trompone.mp3 > /dev/null 2>&1
```

Természetesen ehhez szükség lesz a sad-trompone.mp3-ra is, ami [itt](assets/uploads/2016/12/sad-trompone.mp3) található. Ezután bármikor hibára fut a scriptünk, azt hanggal is a tudtunkra hozza, kollégáink legnagyobb örömére.

[![](assets/uploads/2016/12/angry-xml-sucks-computer-man.jpg)](assets/uploads/2016/12/angry-xml-sucks-computer-man.jpg)

Nos ennyire futotta most, láthattuk, hogy is lehet viszonylag könnyedén ellenőrízni automatizáltan a saját gépünkön. Ez jól jöhet akár van CI szerverünk, akár nem, ugyanis minél előbb vesszük észre a hibákat, annál hamarabb tudunk rájuk reagálni. Persze nehéz bevezetni az ilyesmit, akár egymagunk vagyunk, akár százan dolgozunk a projekten, lesz ellenállás az ilyenekkel szemben, de még mindig jobb ha így derül ki, amolyan titokban, mintsem körbekürtölje a jenkins, hogy biza Te voltál az, aki eltörte a buildet. Értelemszerűen limitáltak a lehetőségeink egy ilyen futtatókörnyezetben, lévén nem akarunk egy órát várni, míg felmegy a push, na meg a komolyabb integrációs, selenium teszteket nem itt fogjuk futtatni, viszont a gyorsabban végrehajtható ellenőrzések számára egy igen korai pont lehet mindez.

A példában szereplő példaprojektet [>>itt<<](https://github.com/letscodehu/combobreaker) találjátok.

> **Update:** Mivel kommentben jelezték, hogy a lint kimaradt, ezért azt is hozzáadnám itt.

Ez azért lehet fontos, mert nem minden fájlt tesztelünk és a checkstyle sem tökéletes ezen a téren, mert habár a legtöbb ilyen lehetséges parse errort észreveszi, de mégsem a PHP értelmezőt futtatjuk a fájllal szemben, hanem tokenekre bontva vizsgáljuk azt.

```
function lint {
    echo -e 'Checking for syntax errors...\c'
    for file in `find src test -type f -iname "*.php" -o -iname "*.phtml"`
    do
        php -l $file > /dev/null 2>&1
        if [ $? != 0 ]
        then
            failed
        fi
    done
    pass
}
```

A fenti kódrészletben a find-al lekérjük rekurzívan az src és test mappában található fájlokat és kiválogatjuk közülük a php és phtml kiterjesztésűeket, majd azok ellen futtatunk egy syntax ellenőrzést és ha hibát találunk, akkor megállítjuk a push-t, ahogy a korábbiakban is tettük. Ezt a git\_checker és a checkstyle közé tettem:

```
header
git_checker
lint
checkstyle
mess_detector
test
exit 0
```