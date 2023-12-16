---
id: 1456
title: 'PHP Docker mögé bújva'
date: '2016-12-31T20:36:55+01:00'
author: tacsiazuma
layout: post
guid: '{{ site.url }}/?p=1456'
permalink: /2016/12/31/php-docker-moge-bujva/
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
image: 'assets/uploads/2016/12/09202430/dockervsphp.jpg'
categories:
    - Laravel
    - PHP
tags:
    - deployment
    - docker
    - environment
    - laravel
    - php
    - php7
---

Ígértem korábban a Passportos verzióját a REST API-nk authentikációjához és ennek az első lépése az, hogy 5.3-as Laravel kell hozzá, ahol bele is futottam a hibába, miszerint lokálisan csak 5.6.3-as PHP-m volt, neki pedig 5.6.4-es kellett volna. Persze mi sem egyszerűbb egy lokális környezetnél, updateljük és ennyi. Sajnos production környezetben nem így szokott mindez történni, no meg jó lenne, ha már a 7-est használnánk, így gondoltam mixelem a kellemest a hasznossal és megnézem mennyire bonyolult bepakolni ezeket dockerbe, úgy hogy működjenek is. A példák, habár Laravel alapúak, a legtöbb PHP keretrendszerre igazak lesznek, ahol a Document Root a public mappára mutat.[![](assets/uploads/2016/12/dockervsphp-1024x576.jpg)](assets/uploads/2016/12/dockervsphp.jpg)

Mégis mi kell itt nekünk? Mire lesz ez az egész jó? A fejlesztést vagy a deploymentet akarjuk megkönnyíteni ezzel? A fejlesztés megkönnyítésére akadnak más módszerek is, amire találtok példákat [itt](https://github.com/laradock/laradock) és [itt](https://shippingdocker.com/blog/laravel-composer/), mi most inkább a deploymentre fogunk rámenni, hogy hogy is tudjuk egyszerűen kijuttatni az alkalmazásunkat egy ún. docker image formájában.

Azt egy [korábbi cikkben]({{ site.url }}/2015/10/25/dokkolnam-dokkolnam/) már megemlítettük, hogy az ilyen image-ek parancsonként egy új file rendszer réteget hoznak létre, majd ezeken alapulnak a konténerek, újabb rétegeket adva hozzá. A mi célunk itt most az lesz, hogy a működő alkalmazásunkat, minden függőségével és konfigurációjával becsomagoljunk egy ilyen image-be, hogy azt könnyedén ki tudjuk tenni a helyére. A példákban viszonylag egyszerű eseteket nézünk még, nem linkelünk hozzá másik konténert, MySQL-t és Redist, hanem feltételezzük, hogy azok a szerveren futnak és nem fogjuk hipp-hopp dockeresíteni őket, mert sok más app függ tőlük ahhoz, hogy ezt csak így meglépjük.

Az image-ünk alapját egy [php image](https://hub.docker.com/_/php/) fogja adni, amiben 7.1-es PHP fut, Apache 2.4.10 mögött.

Első lépésként hozzuk létre a projektünk skeletonját:

```
composer create-project laravel/laravel laradock
```

Ezzel már ott is van a kész projektünk a laradock mappában. A következő lépés legyen egy Dockerfile kreálása a célra a projektünk gyökerében, amit adjunk is majd hozzá a verziókövetéshez.

Első lépés még nem nagyon tér el a dokumentációtól:

```
FROM php:7.1-apache
MAINTAINER Papp Krisztian <fejlesztes@letscode.hu>
```

Ugye amikor ezt lebuildeljük, habár a docker megkapja a build kontextet, vagyis a projektünk fájljait, mégsem kezd vele semmit, a mi feladatunk az, hogy expliciten bemásoljuk azt a helyére.

```
COPY . /var/www/html
```

Ezután a konténerben a projektünk már ott is lesz azon a helyen, ahova az Apache default vhostja be van állítva, buildeljük le és nézzük meg!

```
docker build -t laradock .
```

Ezután próbáljuk ki, hogy működik-e:

```
docker run --rm -p 8888:80 --name laradock laradock
```

Ezután navigáljunk a localhost:8888-ra és láss csódát!

[![](assets/uploads/2016/12/Selection_083-1024x149.png)](assets/uploads/2016/12/Selection_083.png)

403???

Hát igen, ugyanis, amint mondtam a `/var/www/html` az apache default vhost-ja, viszont egy laravel projekt esetében nem erre kell, mutasson, hanem a `public` mappára azon belül. Hogy tudjuk ezt orvosolni? Egyszerűen, gonosz `sed` parancsokkal! Átírjuk a default vhost document rootját.

```
# replacing the docroot
RUN sed -i 's/\/var\/www\/html/\/var\/www\/html\/public/g' /etc/apache2/sites-available/000-default.conf
```

Buildeljük újra és futtassuk újra a projektet:

Hát ezzel se lettünk beljebb, mert most biza 500-as hibát kaptunk. Mitől lehet ez? Hol a szokásos whoops oldalunk? Nos a gond most a jogosultságokkal van. Nézzük meg miért is!

```
docker exec -it laradock ls -lart /var/www/html
```

```
total 224
drwxrwxr-x 2 root root 4096 Oct 3 02:33 tests
drwxrwxr-x 5 root root 4096 Oct 3 02:33 storage
-rw-rw-r-- 1 root root 563 Oct 3 02:33 server.php
drwxrwxr-x 2 root root 4096 Oct 3 02:33 routes
drwxrwxr-x 5 root root 4096 Oct 3 02:33 resources
-rw-rw-r-- 1 root root 1918 Oct 3 02:33 readme.md
drwxrwxr-x 4 root root 4096 Oct 3 02:33 public
-rw-rw-r-- 1 root root 930 Oct 3 02:33 phpunit.xml
-rw-rw-r-- 1 root root 401 Oct 3 02:33 package.json
-rw-rw-r-- 1 root root 558 Oct 3 02:33 gulpfile.js
drwxrwxr-x 5 root root 4096 Oct 3 02:33 database
drwxrwxr-x 2 root root 4096 Oct 3 02:33 config
-rw-rw-r-- 1 root root 1283 Oct 3 02:33 composer.json
drwxrwxr-x 3 root root 4096 Oct 3 02:33 bootstrap
-rwxr-xr-x 1 root root 1646 Oct 3 02:33 artisan
drwxrwxr-x 6 root root 4096 Oct 3 02:33 app
-rw-rw-r-- 1 root root 80 Oct 3 02:33 .gitignore
-rw-rw-r-- 1 root root 61 Oct 3 02:33 .gitattributes
-rw-rw-r-- 1 root root 491 Oct 3 02:33 .env.example
-rw-rw-r-- 1 root root 124714 Dec 29 19:45 composer.lock
drwxrwxr-x 31 root root 4096 Dec 29 19:45 vendor
-rw-rw-r-- 1 root root 542 Dec 29 19:45 .env
drwxrwxr-x 3 root root 4096 Dec 30 16:27 .idea
-rw-rw-r-- 1 root root 222 Dec 30 16:58 Dockerfile
drwxr-xr-x 5 root root 4096 Dec 30 16:58 ..
drwxr-xr-x 13 www-data www-data 4096 Dec 30 16:58 .
```

Hát biza a `root` fájljait valóban nem fogja tudni piszkálni a `www-data` userrel futó apache, ezért nem ártana átállítani azt a Dockerfileban:

```
RUN chown www-data:www-data -R /var/www/html
```

Buildeljük és futtassuk újra:

```
docker build -t laradock .
docker run --rm -p 8888:80 laradock
```

És láss csodát:

[![](assets/uploads/2016/12/Selection_084.png)](assets/uploads/2016/12/Selection_084.png)

Bejött az oldal. Azonban ez még mindig nem jelent semmit. A default Laravel 5.3 egy `/api/user` route-al érkezik, elvileg ennek is működnie kellene, nemde?[![](assets/uploads/2016/12/Selection_085.png)](assets/uploads/2016/12/Selection_085.png)

Ajajj, baj van. Ez azt jelenti, hogy az apache kapta el a kérést és nem pedig a PHP, ez pedig azt jelenti, hogy nem megy a mod\_rewrite. Munkavédelmi szemüveget fel, meghegesztjük!

```
RUN a2enmod rewrite
```

Újrabuild és újra futtatás után az eredmény, át lettünk irányítva a /login oldalra (tehát elkapta a PHP a kérésünket):

[![](assets/uploads/2016/12/Selection_086.png)  ](assets/uploads/2016/12/Selection_086.png)

Akkor most nézzünk valami adatbázis kapcsolatot! Ezt legegyszerűbben egy artisan paranccsal tudjuk, docker exec-el:

```
docker exec -it laradock php /var/www/html/artisan migrate
```

A kimenet pedig:

```
[Illuminate\Database\QueryException] 
 could not find driver (SQL: select * from information_schema.tables where table_schema = homestead and table_name = migrations) 

 [PDOException] 
 could not find driver
```

Ajajj, nem találja a drivereket hozzá, így aztán nehéz lesz bármit is csinálni, nemde? Akkor jöjjön egy újabb sor a Dockerfile-ba:

```
RUN docker-php-ext-install pdo_mysql
```

A fenti parancs egy a PHP image kreálói által készített helper, amivel így tudjuk hozzáadni az új kiterjesztéseket a PHP-hez. Újrabuild és futtatás, majd ismételjük meg a fenti exec parancsot és a hiba mostmár a .env fájl tartalmával lesz.

```
 [Illuminate\Database\QueryException] 
 SQLSTATE[HY000] [2002] Connection refused (SQL: select * from information_schema.tables where table_schema = homestead and table_name = migrations) 
 
 [PDOException] 
 SQLSTATE[HY000] [2002] Connection refused
```

Ezt már mi is ki tudjuk javítani könnyedén, ha testreszabjuk a .env fájlunk tartalmát, netán felülcsapjuk a sajátunkkal. Viszont ezeket a módosításokat nem a saját gépünkön szeretnénk megvalósítani, hanem jó lenne, ha valami build rendszer építené meg, nemde? Ez a rendszer pedig gitből fogja kihúzni a dolgokat, tehát a vendor mappa nélkül (mert azt ugye hozzáadtuk a .gitignore-hoz, ugye? 🙂 ). Akkor a következő lépés az lesz, hogy a composert futtassuk. Sajnos a konténerben alapból nincs benne, ezért előtte le kell szedni azt:

```
RUN php -r "copy('https://getcomposer.org/installer', 'composer-setup.php');"
RUN php -r "if (hash_file('SHA384', 'composer-setup.php') === '61069fe8c6436a4468d0371454cf38a812e451a14ab1691543f25a9627b97ff96d8753d92a00654c21e2212a5ae1ff36') { echo 'Installer verified'; } else { echo 'Installer corrupt'; unlink('composer-setup.php'); } echo PHP_EOL;"
RUN php composer-setup.php
RUN php -r "unlink('composer-setup.php');"

RUN php composer.phar install
```

A függőségek már megvannak, közelebb járunk az igazsághoz mostmár! Upsz. Hiányolja a git meglétét, akkor telepítsük fel azt is (na meg az unzip-et, mert utána azt fogja hiányolni).

```
# we need unzip and git for composer
RUN apt-get update && apt-get -y install git unzip
```

Szóval mostmár tényleg megvannak a függőségek, mire lehet még szükségünk? Igen, bizony, a .env fájlra, valamint a benne található key újragenerálásra. Ez persze framework függő. Azonban a konfigurációt inkább szeparáljuk el mindettől és azt majd a build folyamat előtt még a konténeren kívülről végezzük el, így változó konfigurációkkal tudjuk lebuildelni azt más és más tagekkel.

Mielőtt ezt elérhetővé tesszük futtatásra, nem ártana még teszteket futtatni rá, nemde?

```
RUN ./vendor/phpunit/phpunit/phpunit
```

Amennyiben a tesztek során hiba lép fel, ez megállítja a docker build folyamatát is. Ugyanilyen módon ráengedhetünk kódanalízist is, ahogy a korábbi [pre-push cikk]({{ site.url }}/2016/12/27/pushbreaker-az-elet-ci-szerver-nelkul/)ben is volt róla szó.

Akkor most jöjjön a Jenkins része a dolgoknak. Ehhez semmi más nem kell, mint hogy a Jenkins usere hozzáférjen a `docker.sock`-hoz, tehát hozzá kell adjuk a jenkins felhasználót a docker grouphoz:

```
sudo gpasswd -a jenkins docker

```

Mi is fog történni itt? A jenkins kihúzza a kódot a saját workspace-ébe, a helyére teszi a konfigurációt, aztán azon futtat egy docker buildet. Ezzel a lokális docker repository-ba be is kerül a kód, viszont ezt csak ugyanitt tudjuk használni. Ha mások számára elérhetővé szeretnénk tenni, akkor egy docker repository-t kell létrehoznunk és a build után felpusholni azt.

Itt sokfelé elválhat a további sorsa az imagenek. Kideployolhatjuk azt ún. staging environment(ek)re, ahol nem (vagy épp igen) az éles environmenthez kapcsolódik, a tesztelőink itt elérik azt<del> és olyan Selenium scriptet írnak, ami hazavágja az egészet</del>.

Hozzunk akkor létre két ilyen environmentet, legyen egy staging1.example staging2.example. Ennek nem fogunk DNS rekordot létrehozni, csupán a lokális host fájlunkat piszkáljuk majd meg.

```
<server-ip> staging1.example
<server-ip> staging2.example
```

Az egyik (staging1) ilyen fusson majd a 8888-as porton, a másik (staging2) pedig a 8889-en. A host gépen pedig megy majd egy nginx/apache, ami az adott domain-t továbbdobja a megfelelő portra:

```
<VirtualHost *:80>
 ServerName staging1.example

 <Proxy *>
 Order deny,allow
 Allow from all
 </Proxy>

 ProxyPass / http://localhost:8888/
 ProxyPassReverse / http://localhost:8888/

# SSL-t is itt állítanánk be

</VirtualHost>

```

```
<VirtualHost *:80>
 ServerName staging2.example

 <Proxy *>
 Order deny,allow
 Allow from all
 </Proxy>

 ProxyPass / http://localhost:8889/
 ProxyPassReverse / http://localhost:8889/

# SSL-t is itt állítanánk be

</VirtualHost>
```

Újraindítjuk a webszervert és lecsekkoljuk, hogy valóban hallgat-e rá, mert elvileg ilyenkor jön egy 502-es hibaüzenet, vagyis nem ül még semmi azokon a portokon.

Hozzunk létre két jenkins itemet:

**Example.staging1.build**

**Example.staging2.build**

Ez a két job fogja lebuildelni a különböző konfigurációkkal a dolgot.

Mindkettő annyit csinál, hogy kihúzza a repóból a kódot, utána pedig futtat egy shell scriptet:

```
cp .env.staging1 .env
docker build -t example-staging1 .
```

A másik pedig:

```
cp .env.staging2 .env
docker build -t example-staging2 .
```

> Persze lehet konfigurációtól függetlenné tenni és a run parancsnál bemountolni vagy épp [bemásolni](https://docs.docker.com/engine/reference/commandline/cp/) a konfigurációt. Abban az esetben nem kell külön imageket létrehozni, de már így is rengeteg új infó lehet itt, nem akarom még azt is belekeverni.

Na de mi is van ebben a két **.env** fájlban? A lényeges pont itt a redis és a mysql elérési útja/hozzá tartozó jelszók.

Ha már úgyis dockerről van szó, akkor lőjünk fel egy mysql-t és egy redis-t a hoston.

```
docker run -d --name common-redis redis
docker run -d --name common-mysql-server -e 'MYSQL_ROOT_PASSWORD=somerootpassword' -e 'MYSQL_DATABASE=example' -e 'MYSQL_USER=example' -e 'MYSQL_PASSWORD=password' mysql
```

A MySQL root jelszavát adtuk meg, egy adatbázist, amire teljeskörű hozzáférést kap a megadott example user a password jelszóval. Ezután már némileg másképp néz majd ki a történet, ugyanis úgy indítjuk el a konténerünket, hogy hozzálinkeljük az alábbiakat. Amikor hozzálinkelünk egy konténert, akkor igazából annyi történik, hogy a konténer host fájljába bekerül az általunk megadott hostnévvel a linkelt konténer IP-je.

Tehát ha lefuttatjuk az alábbi kódot:

```
docker run -d --name example-staging1 --link common-mysql-server:mysql --link common-redis:redis -p 8888:80 example-staging1
```

Akkor létrejön a konténerben az alábbi host fájl:

```
127.0.0.1 localhost
::1 localhost ip6-localhost ip6-loopback
fe00::0 ip6-localnet
ff00::0 ip6-mcastprefix
ff02::1 ip6-allnodes
ff02::2 ip6-allrouters
172.17.0.3 redis ab96a646b6fc common-redis
172.17.0.2 mysql a3f53a7bdf7e common-mysql-server
172.17.0.4 d08c45af72fe
```

Vagy valami ehhez hasonló 🙂 A lényeg, hogy mostantól hostnév alapján adhatjuk meg a szükséges service-eket a konfigban, nem kell találgatnunk, portot nyitni nekik dockeren, stb.

A .env lényeges része így:

```
DB_CONNECTION=mysql
DB_HOST=mysql
DB_PORT=3306
DB_DATABASE=example
DB_USERNAME=example
DB_PASSWORD=password
```

```
CACHE_DRIVER=redis
```

```
REDIS_HOST=redis
REDIS_PASSWORD=null
REDIS_PORT=6379
```

A staging1-et beállíthatjuk eszerint, a staging2-t pedig egy éles környezetre tudjuk belőni.

Ez még csak a build feladat volt, azonban a deploy job hátravan

Ezeket a jenkins jobokat nem triggereli kívülről, explicit indítjuk el a folyamatot, de igazából kívülről elindulhat, ha a build feladat hibátlanul lefutott.

A shell parancs itt csupán ennyi lesz az egyes jobokra:

```
docker stop example-staging1 || true
docker rm example-staging1 || true
docker run -d --name example-staging1 --link common-mysql-server:mysql --link common-redis:redis -p 8888:80 example-staging1
```

A másik pedig nagyon hasonló, leszámítva a környezeteket:

```
docker stop example-staging2 || true
docker rm example-staging2 || true
docker run -d --name example-staging2 --link some-prod-mysql-server:mysql --link some-prod-redis:redis -p 8888:80 example-staging2
```

A `|| true` azért kell, hogy az első build, amikor nincs még kint az alkalmazás, akkor se szakítsa meg a build folyamatát a jenkinsben a hiba miatt.

Na de honnan tudjuk, hogy minden megy-e az alkalmazásunkban? Laravelhez vannak [healthcheck](https://github.com/npmweb/laravel-health-check) csomagok, de mi most valami roppant egyszerű megoldást szeretnénk.

Vegyünk fel egy új route-ot a routes/api.php-ben:

```
Route::get("/healthcheck", "HealthCheckController@check");
```

Hozzunk létre egy új kontrollert:

```
<?php

namespace App\Http\Controllers;

class HealthCheckController extends Controller
{
    public function check() {
        return [
            "sql" => $this->checkSql(),
            "version" => env("version", '1.0'), // a verziónkat tudjuk lekérni .env fájlból, vagy épp ahonnan szeretnénk
            "redis" => $this->checkRedis()
        ];
    }

    private function checkRedis() {
        try {
            \Cache::put("healtcheck", 1, 30);
        } catch(\Exception $e) {
            return false;
        }
        return true;
    }

    private function checkSql() {
        try {
            \DB::statement("show tables");
        } catch(\Exception $e) {
            return false;
        }
        return true;
    }
}
```

Így, amikor kideployoljuk a staging1 és staging2-t, és meglőjük a staging1.example/api/healthcheck URL-t láthatjuk majd, hogy épp melyik verzió van kint belőlük, valamint azt is, hogy a mysql-hez és redis-hez hozzáférnek-e:

[![](assets/uploads/2016/12/Selection_087.png)](assets/uploads/2016/12/Selection_087.png)

Ha több alkalmazásunk van, akkor ezeket csokorba szedhetjük és létrehozhatunk egy külön oldalt erre, ami X időnként rálő az URL-ekre és így láthatjuk az egyes alkalmazásainkat, hogy is állnak és valami shiny felületen megjeleníti azt.

Most ennyi fért bele, remélem érthető mások számára is, ha nem, akkor [írjátok](mailto:fejlesztes@letscode.hu) meg, ha tetszett, akkor is! 🙂