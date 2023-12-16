---
id: 2370
title: 'ASDF &#8211; a fura nevű verziómenedzser'
date: '2020-10-12T22:41:42+02:00'
author: tacsiazuma
layout: post
guid: '/?p=2370'
permalink: /2020/10/12/asdf-a-fura-nevu-verziomenedzser/
newsphere-meta-content-alignment:
    - align-content-left
image: 'assets/uploads/2020/10/14002755/pexels-steve-johnson-1000366.jpg'
categories:
    - Egyéb
tags:
    - asdf
    - management
    - tool
---

#### TLDR; Az asdf képes menedzselni a rendszerünkön a globális és projekt specifikus verziókat, legyen az node, java, maven, kubectl vagy bármi. A github projekt [itt](https://github.com/asdf-vm/asdf "itt") található, ahol a leleményesebbek már el is igazodhatnak.

> "A verziók menedzselése egyszerű"

gondolta Krisztián, aztán egy óráig vakargatta a fejét, hogy feloldjon egy ciklikus dependenciát.

Ilyen és hasonló okok miatt jöttek létre a különböző eszközökhöz tartozó verzió menedzselő szoftverek, mint pl a node version manager, jenv, a python virtual env, hogy a krónikus konténerizálókról se feledkezzünk meg. Mindegyik el tudja látni a feladatot, hogy viszonylag könnyen és gyorsan leválasszunk egy-egy eszközt a többitől és annak verzióját valahol kezeljük. Viszont a gond ott van, hogy ezeket meg kell találni, fel kell telepíteni, konfigurálni kell és aztán végtelen rc fájlunk lesz, projektszerte. Mi lenne, ha... hát persze, hogy valaki már megoldotta mindezt!

Az asdf, az egyik talán legfurcsább nevű verzió menedzselő, amivel találkozhatunk. Alapból kb semmit sem tud, viszont az egyes eszközökhöz készített pluginekkel felvértezve már annál többet. Akinek nem okoz fejfájást, hogy a különböző projektekhez különböző verziók kellenek, annak is jól jöhet, mert a segítségével, akár egyetlen fájlban lehet menedzselni a rendszerünkön levő eszközöket, ami egy esetleges újratelepítés esetén igencsak jól tud jönni, hogy nem kell egyesével letöltögetni azokat, esetleg keresgélni egy régebbi verziót, mert a legfrissebbel már nem fordul a projekt, de csapjunk is bele!

A dokumentációt a <https://asdf-vm.com/#/core-manage-asdf> címen találjuk. Az első lépés nyílván a telepítése lesz. Linux és MacOS rendszerekre elérhető, de értelemszerűen a linux alrendszerrel Windows alatt is használhatjuk. Mi most a linux és azon belül is egy ubuntuhoz tartozó verziót fogunk felrakni. Először a függőségek legyenek meg, szerencsére ez elég minimális.

```
sudo apt install curl git
```

Ha ezek fent vannak, akkor már tudjuk is telepíteni, mégpedig egy sima git clone-al, a 0.8.0-ás verziót:

```
git clone https://github.com/asdf-vm/asdf.git ~/.asdf --branch v0.8.0
```

Nyílván ez még nem elég, a .bashrc-be fel kell venni, hogy a shellben elérhető legyen:

```
echo ". $HOME/.asdf/asdf.sh" >> .bashrc
```

A shellben a kiegészítés sajnos ezzel még nem fog működni, ahhoz az alábbi paranccsal a kódkiegészítést is be kell olvasni:

```
echo ". $HOME/.asdf/completions/asdf.bash" >> .bashrc
```

Hogy érvénybe léptessük a módosításokat, indítsuk újra a <del>rendszert</del> shellt. Ezután már az asdf paranccsal tudunk betyárkodni. Keressünk egy remek mappát és nézzük meg mit is tudunk ott csinálni.

```
mkdir some-project
cd some-project
asdf 
```

Ez utóbbi kiírja a rengeteg parancs lehetőségét, amik közül most elsőnek nézzük az info-t

```
$ asdf info
OS:
Linux rucsok-core 5.4.0-48-generic #52-Ubuntu SMP Thu Sep 10 10:58:49 UTC 2020 x86_64 x86_64 x86_64 GNU/Linux

SHELL:
GNU bash, version 5.0.17(1)-release (x86_64-pc-linux-gnu)
Copyright (C) 2019 Free Software Foundation, Inc.
License GPLv3+: GNU GPL version 3 or later <http://gnu.org/licenses/gpl.html>

This is free software; you are free to change and redistribute it.
There is NO WARRANTY, to the extent permitted by law.

ASDF VERSION:
v0.8.0-c6145d0

ASDF ENVIRONMENT VARIABLES:
ASDF_DIR=/home/tacsiazuma/.asdf

Oohes nooes ! No plugins installed
ASDF INSTALLED PLUGINS:
```

Ide fogja felsorolni a telepített plugineket is, ha majd lesznek. Minden eszközt egy-egy plugin fog menedzselni, amik mind az ASDF\_DIR-ben található mappába kerülnek. Amit mi használunk majd, az a java, maven és nodejs és php lesz, de százával található még plugin. Telepítsük hát fel azt a négyet, ami nekünk kell:

```
asdf plugin add nodejs
asdf plugin add java
asdf plugin add maven
asdf plugin add php
```

Ha látni akarjuk a plugineket, amik elérhetőek:

```
asdf plugin list all
```

Ezután már az infoban megjelennek a pluginek, de még egy verziót sem kapunk:

```
asdf current
```

Ez a parancs szolgál arra, hogy megnézzük az adott mappában/shellben mik is az aktuális verziók. Na meg azt is mutatja, hogy hogy is kell újat beállítani, de nézzük is meg akkor!

```
asdf global java openjdk-14
```

Viszont ez hibaüzenetet eredményez:

```
version openjdk-14 is not installed for java
```

Akkor installáljuk, ami majdnem ugyanaz, mint az előző parancs:

```
asdf install java openjdk-14
```

Mivel nincs kimenet nézzük meg, hogy mi történt:

```
$ java -version
openjdk 14 2020-03-17
OpenJDK Runtime Environment (build 14+36-1461)
OpenJDK 64-Bit Server VM (build 14+36-1461, mixed mode, sharing)
```

Tehát először hozzá kell adni a plugint, utána telepíteni kell a verziót, amit aztán után aktiválni tudunk.  
Ezután nézzük meg a mavent is:

```
asdf install maven 3.6.0
asdf global maven 3.6.0
```

Eztuán nézzük a verziót, hogy stimmel-e:

```
$ mvn --version
Apache Maven 3.6.0 (97c98ec64a1fdfee7767ce5ffb20918da4f719f3; 2018-10-24T20:41
:47+02:00)
Maven home: /home/tacsiazuma/.asdf/installs/maven/3.6.0
Java version: 14, vendor: Oracle Corporation, runtime: /home/tacsiazuma/.asdf/
installs/java/openjdk-14
Default locale: en_US, platform encoding: UTF-8
OS name: "linux", version: "5.4.0-48-generic", arch: "amd64", family: "unix"
```

A következő kettő már trükkösebb, ugyanis itt már vannak előfeltételek. A nodejs-hez a PGP kulcsokat kell importálni előtte, amit le is írnak a [pluginnál](https://github.com/asdf-vm/asdf-nodejs "pluginnál"):

```
bash -c '${ASDF_DATA_DIR:=$HOME/.asdf}/plugins/nodejs/bin/import-release-team-keyring'

asdf install nodejs 12.13.0
asdf global nodejs 12.13.0
asdf current
```

Most akkor csak a PHP van hátra, amihez rengeteg függőség kell majd, ezeket a php plugin [tesztleírójából](https://github.com/asdf-community/asdf-php/blob/master/.github/workflows/workflow.yml "tesztleírójából") csentem:

```
sudo apt-get update && sudo apt-get install autoconf bison build-essential curl gettext git libcurl4-openssl-dev libedit-dev libicu-dev libjpeg-dev libmysqlclient-dev libonig-dev libpng-dev libpq-dev libreadline-dev libsqlite3-dev libssl-dev libxml2-dev libzip-dev openssl pkg-config re2c zlib1g-dev -y

asdf install php 7.4.0
asdf global php 7.4.0
```

Ezután a php verziót is ellenőrízzük:

```
$ php --version

PHP 7.4.0 (cli) (built: May 26 2020 12:24:22) ( NTS )
Copyright (c) The PHP Group
Zend Engine v3.4.0, Copyright (c) Zend Technologies
```

Eddig viszont még semmi különleges nem történt, akkor nézzük meg, hogy is lehet mappa vagy éppen projektspecifikussá tenni a dolgokat?

```
mkdir dummy-project
cd dummy-project

echo "java openjdk-11" > .tool-versions

java --version
```

Hoppá, nincs meg a megfelelő java verzió? Bizony, ugyanis a` .tool-versions ` fájl az adott mappára adja meg a verziókat, illetve írja felül azt, ami a home folderben található. Erre jobb, ha megnézzük milyen verziókat lát az asdf:

```
asdf current
```

Itt már a parancsot is látjuk, amivel fel tudjuk telepíteni azt.

```
asdf install java openjdk-11
java --version
```

Ezután már a megfelelő java verzió lesz elérhető az adott kontextusban, de ez még semmi.  
Mi van akkor, ha most húzzuk le a projektet amin el kell kezdeni dolgozni és ott van egy .tool-versions fájl? Sőt, ez még ruby-t is használ, amit mi nem telepítettünk korábban.

```
asdf install
```

Hát bizony ez nekünk nem segít, ugyanis nem is vesz tudomást a ruby-ról. Hogy észrevegye, a ruby plugint is telepíteni kell. A PR, ami erre szolgálna, hogy egy kapcsolóval meg tudjuk oldani ezt, [itt](https://github.com/asdf-vm/asdf/pull/313 "itt") található. Addig marad a kézi hajtányos megoldás:

```
asdf plugin add ruby
asdf install
```

Ezután már a ruby is elérhető az adott mappában, de csak ott:

```
$ ruby --version
ruby 2.6.6p146 (2020-03-31 revision 67876) [x86_64-linux]

$ cd ..
$ ruby --version
No version set for command ruby
```

Na de mi ez a global meg local meg shell?

A global az a home mappában levő `.tool-versions-`ben állítja be a verziót az adott felhasználóra, a local az adott mappára specifikus verziót állít be és a mappában fogja létrehozni a `.tool-versions` fájlt, a shell pedig egy környezeti változóba teszi mindezt.

Ha nincs meg, hogy melyik verzió is kell és a legújabbat akarjuk, akkor ha a plugin telepítve van, a `latest` paranccsal tudjuk előcsalni azt (már ha a pluginben implementálták, mert a java nem ad választ erre):

```
$ asdf latest ruby
2.7.2
```

Összességében az asdf egy igen hasznos kis eszköz, aminek legfőbb hátránya, hogy bizony egyes eszközök telepítése igen lassú, ha azt forrásból kell telepíteni. Ha ezzel együtt tudunk élni, vagy éppen nem használunk ilyen eszközöket, akkor jó lehet a saját gépre, projektek közt, CI/CD-be bekötve is.