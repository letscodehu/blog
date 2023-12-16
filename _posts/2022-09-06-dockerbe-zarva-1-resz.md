---
id: 6472
title: 'Dockerbe zárva &#8211; 1. rész'
date: '2022-09-06T19:42:00+02:00'
author: tacsiazuma
layout: post
guid: '{{ site.url }}/?p=6472'
permalink: /2022/09/06/dockerbe-zarva-1-resz/
newsphere-meta-content-alignment:
    - align-content-left
amazonS3_cache:
    - 'a:2:{s:77:"//d1nggucqgkhstg.cloudfront.netassets/uploads/2018/03/09202440/9x47d.jpg";a:2:{s:2:"id";s:4:"1640";s:11:"source_type";s:13:"media-library";}s:50:"//letscode.huassets/uploads/2018/03/9x47d.jpg";a:2:{s:2:"id";s:4:"1640";s:11:"source_type";s:13:"media-library";}}'
image: 'assets/uploads/2015/10/contfail.bmp'
categories:
    - Backend
    - DevOps
    - 'Kocka élet'
tags:
    - composer
    - devex
    - docker
    - php
---

Akik nem egyetlen monolit alkalmazással dolgoznak éveken át, azok valószínűleg szembesültek már azzal a problémával, hogy bizony menedzselni kell az eszközök, fordítók, stb. verzióit a projektek és szolgáltatások között.

Erre vannak már persze megoldások, node.js-re ott az [nvm](https://github.com/nvm-sh/nvm "nvm"), javara ott a [jenv](https://www.jenv.be/ "jenv"), vagy minden másra ott az [asdf](https://asdf-vm.com/ "asdf"), amiről [írtam]({{ site.url }}/2020/10/12/asdf-a-fura-nevu-verziomenedzser/ "írtam") is már korábban. Ezek azonban ugyanúgy elszórtan a home könyvtárunkban tárolják a dolgokat, ha takarítani akarunk utánuk, akkor mindenhova be kell nézni, egyik gépről a másikra a konfigurációt nem mindig lehet jól átvinni, sőt némelyik még igen lassú is, pl az ASDF segítségével a PHP telepítése igen körülményes, le kell tölteni egy plugint, amihez kellenek ilyen-olyan csomagok is, le kell fordítani az egész PHP-t hozzá, és így tovább. Így valami jobban használható megoldás után kell nézni. Itt jött a képbe a Docker, a Docker Compose és az aliasok.

Ez a cikk eredetileg Ádám ötlete volt, de mivel nemigen haladt az elmúlt egy évben vele, ezért átvettem, sőt igazából újraírtam, ugyanis teljesen másként közelítettük meg, vagy éppen másban láttuk az alapproblémát. Az itt leírtak megértéséhez a Docker + Docker Compose alapvető ismerete és a bash vagy más shell ismerete szükséges.

Szóval az alapprobléma számomra az, hogy habár sok mindent fel tudok telepíteni a gépemre scriptelve - ahogy arról már írtam is [itt]({{ site.url }}/2021/03/16/menedzseljuk-a-sajat-gepunket/ "itt") -, akadnak olyan eszközök, amikből a verziók ütköznének, nehézkes lenne a váltás a verziók között, vagy éppen hosszadalmas folyamat.

### Docker nélkül

A példáimban egy Ubuntu 22.04-et fogok használni.

Tegyük fel, hogy PHP fejlesztőként dolgozunk, az eszközök, amiket használunk a napi munkához a PHP, Apache, MySQL, na meg a Composer. Ez még nem is teszi szükségessé a dockerizálást, de majd mindjárt bonyolítjuk a dolgot. Ha Docker nélkül állnánk neki, akkor ezt megoldanánk egy:

```
$ sudo apt install -y php8.1 mysql-server composer
```

paranccsal és már futna is az apache 2.4, PHP 8.1, egy MySQL 8.0 és a composer 2.2.6. Na igenám, de mi van, ha nekünk 7.4-es PHP kell meg 5.7-es MySQL? Itt már kezd bonyolódni a dolog. Kezdjük a PHP-vel:

Először is kellenek bizonyos csomagok:

```
$ sudo apt install -y software-properties-common ca-certificates lsb-release apt-transport-https
```

Utána hozzá kell adni egy ppa-t, amiben a php verziók vannak:

```
$ LC_ALL=C.UTF-8 sudo add-apt-repository ppa:ondrej/php 
```

Azután pedig tudjuk telepíteni azt:

```
$ sudo apt install -y php7.4
```

Most jöhet a MySQL!

Itt már nem lesz lehetőségünk ppa-t használni, direktben kell letölteni a mysql oldaláról a .deb fájlt és telepíteni azt:

```
$ wget https://dev.mysql.com/get/Downloads/MySQL-5.7/mysql-community-server_5.7.38-1ubuntu18.04_amd64.deb
$ dpkg -i mysql-community-server_5.7.38-1ubuntu18.04_amd64.deb
```

Annyira nem is volt bonyolult, akkor meg minek ez a nagy felhajtás? Hát például azért, ugyanis most vagy az 5.7-es vagy a 8-as MySQL fut a gépen, ahogy a PHP-ből is már a 7.4-es fog menni a 8.1 helyett. Persze ez lehet nem is baj, ha úgy gondolod, hogy neked ez elég, a Docker pedig istenkáromlás, akkor ne is olvasd tovább a cikket.

![]({{ site.url }}assets/uploads/2018/03/9x47d.jpg)

### Docker Compose

Ha már maradtál, akkor nézzük hogy is lehet ezt megoldani dockerben?

Első lépésként jó lenne, ha meg tudnánk tekinteni a weboldalt lokálban, működés közben. Ehhez a Dockert átugorva rögtön a Docker Composet fogjuk segítségül hívni és írunk egy `docker-compose.yml`-t a projektünk gyökerébe:

```
services:
    php:
        image: php:7.4-apache
        volumes:
        - ./www:/var/www/html
        network_mode: host
    mysql:
        image: mysql:5.7
        network_mode: host
        volumes:
        - mysql_data:/var/lib/mysql
        environment:
        - MYSQL_ROOT_PASSWORD=password
volumes:
    mysql_data:
```

A fenti konfig a hosztgép hálózatát használja, szóval feltételezi, hogy a 80-as, 443-as és a 3306-os port szabad. Ha egyszerre több projektet futtatunk, akkor természetesen nem így használjuk, de van ahol jól jöhet ( ha mondjuk localhostként akarunk hivatkozni az adatbázisra, vagy ha nem apache-al, hanem a PHP built-in webszerverével dolgozva localhostként akarjuk azt elérni). Indítsuk el:

```
$ docker-compose up -d
```

A `www` mappában pedig a projektünk fog elhelyezkedni, ami most egy sima `index.php` lesz, amivel lecsekkoljuk, hogy valóban tudunk-e csatlakozni az adatbázishoz:

```
$connection = mysqli_connect("localhost:3306", "root", "password");
if (!$connection) {
    echo mysqli_connect_error();
}
```

Ezt ha elindítjuk. akkor egy újabb problémával szembesülünk, mégpedig azzal, hogy a `mysqli` kiterjesztés hiányzik. Ezt meg tudjuk oldani úgy, hogy a projektünk mappájában elhelyezünk egy `Dockerfile`-t, amiben minden benne lesz, ami az alkalmazáshoz kell:

```
FROM php:7.4-apache
RUN docker-php-ext-install mysqli
```

Jelenleg ez nem valami sok, de azért is jobb így, mert még ha az éles környezetben nem is Dockerben fut, így dokumentálva van, hogy mire is van szüksége az alkalmazásnak. Leállítani pedig a

```
docker-compose down
```

segítségével tudjuk. Ebben az esetben az adatbázis tartalma megmarad, ha pedig szeretnénk azt is eltüntetni, akkor a

```
docker-compose down -v
```

lesz a megoldás, ami a volumeokat is törli.

### Composer

Oké, de mi a helyzet például a tesztek futtatásával vagy éppen a függőségek telepítésével? Mivel nincs PHP telepítve a gépen, ezért nem tudjuk konténeren kívül futtatni a teszteket, sem a függőségeket telepíteni. Na de akkor mégis hogy fogjuk ezt megoldani? Kezdjük a composerrel, ugyanis tesztek futtása teszt lib nélkül úgysem fog menni.

Először is fogjuk és belevarázsoljuk a Composert a Docker képfájlunkba:

```
FROM composer/composer # itt érdemes legalább minor verzióig befixálni
FROM php:7.4-apache

COPY --from=composer/composer /usr/bin/composer /usr/bin/composer
RUN docker-php-ext-install mysqli
```

Itt lényegében a composer imageből átemelünk egy fájlt, ami nekünk kell és ezután az általunk épített képfájlban is elérhető lesz.  
Újrabuildeljük az imageket és elindítjuk ismét:

```
$ docker-compose build
$ docker-compose up -d
```

Ezután a composer már elérhető a futó `php` konténerben.

### docker-compose exec módszer

Tehát fut két konténer, egyikben ott a MySQL, a másikban pedig az Apache, valamint a PHP mysqli kiterjesztéssel és a composerrel.

Itt elválik az út kétfelé, az egyik módszer, hogy nyitunk egy shellt a konténeren belül és ott dolgozunk:

```
$ docker-compose exec -it -u $(id -u):$(id -g) php bash
$ composer init
```

Itt a Docker Compose segítségével indítunk egy shellt, mégpedig úgy, hogy a saját felhasználónkat és csoportunkat használjuk a konténeren belül is. Ezáltal a programok úgy lesznek futtatva, mintha mi futtatnánk azokat, így nem lesz gond a létrehozott fájlok jogosultságával. Az egyetlen hátránya, hogy habár ID van, de konténeren belül a mi felhasználónk nem létezik, így a whoami parancs hibát okoz és a bash is azt írja, hogy "I have no name".

Ezzel az a baj, hogyha nincs még egyetlen projekt sem, ahol futna a `docker-compose`, akkor nem fog menni a composer, tehát projektet sem tudunk vele létrehozni.

A másik módszerrel viszont kívülről szeretnénk futtatni a composert vagy éppen a PHP-t:

```
$ docker-compose exec -it -u $(id -u):$(id -g) php composer init
```

Viszont ez nem valami szép, nem várhatjuk el, hogy a felhasználó mindig beírja ezt a hosszú parancsot, nemde? Itt jönnek képbe az aliasok!

```
$ alias composer="docker compose exec -u $(id -u):$(id -g)  php composer"
```

### A fránya mappák

Mindkét megoldással az a baj, hogyha egy másik mappában vagyunk éppen, akkor bizony nem úgy fog működni, mint ahogy mi szeretnénk. Tegyük fel, hogy a `/home/ubuntu/work/project_1` mappában van a projektünk, ahol a `docker-compose`-t indítottuk. Ha most visszalépünk a `/home/ubuntu/work` mappába és kiadjuk a `composer init` parancsot, akkor az ugyanúgy a `/home/ubuntu/work/project_1` mappát fogja látni, ugyanis a `docker-compose` indításakor az a mappa lett bemountolva.  
Erre a megoldás az lehet, hogyha a composer külön konténerben indul, mindig az adott mappát megkapva kontextusként, ahol indítottuk. Ebbe az irányba fogunk tovább haladni a következő részben.