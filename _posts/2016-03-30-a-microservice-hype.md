---
id: 1047
title: 'A microservice hype'
date: '2016-03-30T19:45:09+02:00'
author: tacsiazuma
layout: post
guid: '{{ site.url }}/?p=1047'
permalink: /2016/03/30/a-microservice-hype/
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
dsq_thread_id:
    - '4706408632'
    - '4706408632'
newsphere-meta-content-alignment:
    - align-content-left
image: 'assets/uploads/2016/03/09202050/micro-service-architecture.png'
categories:
    - Advanced
    - Egyéb
tags:
    - 'api gateway'
    - eureka
    - microservice
    - monolith
    - pattern
    - 'service discovery'
    - 'service registry'
---

Már egy jó ideje a csapból is az folyik (szerencsére már megunták), hogy a microservice architektúra mennyire cool és hogy a monolit alkalmazások fejlesztése buzis. A cikkben arról lesz szó, hogy is kell kivitelezni egy ilyet, mitől is microservice, miért ősrégi maga a fogalom, mik a hátulütői, és még sok más!  
[![micro-service-architecture](assets/uploads/2016/03/micro-service-architecture.png)](assets/uploads/2016/03/micro-service-architecture.png)

**Mi is az a microservice és lesz-e belőle házi feladat?**

A legtöbb alkalmazás, amivel találkozunk, vagy épp azt fejlesztjük, azok ún. monolitikus alkalmazások, melyek lényege, hogy az applikáció összes funkciója és modulja egybe van gyúrva. Mindenki ugyanazzal a nagy kódbázissal dolgozik, amikor új verzió kerül ki, akkor egyben kikerül minden.

De nézzünk valami példát, aminek mentén el tudjuk képzelni a dolgot!

Tegyük fel, hogy megelőztük az összes webanalítikai szolgáltatót, vagy épp valami speciálissal akarunk betürni erre a piacra. Ha megvizsgáljuk, ennek az alkalmazásnak milyen részei vannak? Nos, mindenképp van egy feldolgozó API, amin át érkeznek a statisztikák, valamin van egy adminisztrációs felülete, ahol a csili-vili grafikonokat gyártjuk abból a rengeteg adatból, ami érkezik. Van egy adatbázisunk, amivel mindkét felület dolgozik. De fejeljük meg mindezt és legyen valami mobilapplikációnk is hozzá, ami szintén egy API-n át ugyanebből az adatbázisból cibálja le a dolgokat. Tehát alapvetően van három különálló modulunk.

<figure aria-describedby="caption-attachment-1050" class="wp-caption aligncenter" id="attachment_1050" style="width: 455px">[![monolith](assets/uploads/2016/03/monolith.png)](assets/uploads/2016/03/monolith.png)<figcaption class="wp-caption-text" id="caption-attachment-1050">Monolit eset</figcaption></figure>

Tegyük fel, hogy az egészet napfényes PHP-ben csináltuk, mondjuk Laravelben. Tök jól megy a cucc, beindul a biznisz, viszik mint a cukrot. Amikor nő a terhelés, elkezdjük bővíteni az egészet:

<figure aria-describedby="caption-attachment-1051" class="wp-caption aligncenter" id="attachment_1051" style="width: 441px">[![monolith_load](assets/uploads/2016/03/monolith_load.png)](assets/uploads/2016/03/monolith_load.png)<figcaption class="wp-caption-text" id="caption-attachment-1051">A komplett alkalmazást duplikáljuk</figcaption></figure>

Valamelyik kávégőzös reggelünkön rálesünk a logokra és látjuk, hogy bizony a mobilt nem nagyon használják, meg a dashboardra is időszakosan néznek rá, ellenben a logokat okádják befelé, így az ezért felelős modul okozza a terhelést. Ekkor jön bennünk az ötlet, hogy mi lenne, ha nem az egész rendszert duplikálnánk, hanem leválasztanánk az adatfeldolgozó modult és csak azzal tennénk meg?

<figure aria-describedby="caption-attachment-1052" class="wp-caption aligncenter" id="attachment_1052" style="width: 301px">[![process_micro](assets/uploads/2016/03/process_micro.png)](assets/uploads/2016/03/process_micro.png)<figcaption class="wp-caption-text" id="caption-attachment-1052">Csak a feldolgozót duplikáljuk</figcaption></figure>

Na most, hogy sikerült leválasztanunk a feldolgozót, megcsináltuk életünk első microservice-ét! Igaz ez még elég halovány, mert egymás között nem kommunikálnak, de megtettük az első lépést.

> Mielőtt mindenhol microservice-eket látnánk és képzelnénk el velük a csodás jövőt, előre szólok: a microservice-ek plusz komplexitást visznek a rendszerbe, ami komplexitás, akárkinek a szemével nézzük: szívás.

**Konkurencia!**

Ahogy ível a termékünk felfelé, gonosz módon betör a konkurencia is a piacra, mert ő is szeretne egy minél nagyobb szeletet a tortából, így versenyeznünk kell vele. A látogatottság már kevés, a beágyazókódunkkal immáron mindenféle eseményt is szeretnének logolni az emberek. Ahhoz, hogy ezt megvalósítsuk, apróbb módosításokra van szükség az adatbázis sémánkban, viszont akármilyen apró, ez biza valahol be fog kavarni.[![burning_db](assets/uploads/2016/03/burning_db.png)](assets/uploads/2016/03/burning_db.png)

Nos a helyzet az, hogy a dashboard és a mobile még a régi séma szerint várná az adatokat, a process viszont már átállna a következő verzióra, de nem lehet, mert ha lefutnak a migrációk akkor a dashboard hal le és nem tér észhez, amíg az sem frissül az új séma szerint. Tehát hiába is lenne független a deployment, mégsem az.

Na most mielőtt belemennénk a verziókba, térjünk vissza az adatbázishoz. Microservice-ek esetében nem megengedhető, hogy két service egyazon adatbázist használja (vagy legalábbis egyazon táblákat). Itt szükség van egy service-re, ami kommunikál az adott adatbázissal és kiszolgálja a kéréseket, a maga RESTful módján ( legyen pl. Lumen, mert ez igazából csak pár táblát fog kiszolgálni).[![logservice](assets/uploads/2016/03/logservice.png)](assets/uploads/2016/03/logservice.png)

Na most a probléma már máshol van, mivel már a service-ek közötti kommunikáció lesz inkompatibilis.

Erre a megoldás nem lesz más, mint az, hogy verziózzuk az egyes service-eket, mégpedig a szemantikus verziózás szabályai szerint. Tehát főverzió változás esetén visszafele nem kompatibilis változások jönnek a rendszerbe, mert el fog jönni az a szint, mikor az adataink annyira különbözőek lesznek, hogy azt nem lehet elburkolni a service-en belül.

Na de akkor mi is lesz ennek a folyamata?

Létrehozunk két logService-t. Az egyik v1.1, a másik legyen pl. v2.0.

[![step1](assets/uploads/2016/03/step1.png)](assets/uploads/2016/03/step1.png)  
Egy ideig párhuzamosan fut a kettő:[![steptwo](assets/uploads/2016/03/steptwo.png)](assets/uploads/2016/03/steptwo.png)

Amíg az összes, v1.1-et használó service nem szűnik meg, ekkor pedig lekapcsolhatjuk a v1.1 logService-t. Na most aki nem érzi át, hogy ez mekkora szívás... az nyugodtan használjon mindenhol microservice-eket 🙂[![stepthree](assets/uploads/2016/03/stepthree.png)](assets/uploads/2016/03/stepthree.png)

Azonban eljön a nap, hogy kedves felhasználók is és megpróbálják a sz\*rt is kihajtani a kis feldolgozónkból. Az ottani laravelt lecseréljük valami light keretrendszerre, mert minek több? Ez valamennyit segít a dolgon, de amint ezt meglépjük, bizony az adatbázisunk kezdi beadni a kulcsot, master-slave ide vagy oda, ugyanis a processt rengetegen hívogatják, az pedig a logservice-en át gőzerővel rakosgatja be az új rekordokat az adatbázisba. Valamit kezdeni kell ezekkel a spike-okkal.[![serviceburn](assets/uploads/2016/03/serviceburn.png)](assets/uploads/2016/03/serviceburn.png)

**Queue**

A service-ek közötti load elosztását queue-kkal lehet megoldani. Ennek a lényege, hogy a process API nem közvetlenül hívogatja a logService-t, hanem egy message queue-ra dobálja a beérkező adatot, ahonnan fix, tatás tempóban történik a feldolgozás az ún. workerek által, ezáltal a spike-ok ki lesznek simítva.[![queue](assets/uploads/2016/03/queue.png)](assets/uploads/2016/03/queue.png)

A workerek ahogy tudják dolgozzák fel a dolgot, de mi van akkor, ha a bejövő mennyiség több, mint amennyit a workerek fel tudnak dolgozni? Még több worker! Igen, ezeket is külön lehet om-nom-nomolni, mert ha a queue limitjét (ami nem végtelen, lévén ezt valahol tárolni is kell) túllőjük, akkor bizony ami nem fért el.. az elveszik.

Most térjünk át egy kicsit másik példára!

**Webshop (ami nem Magento)**

Tegyük fel, hogy van egy jól szituált webshopunk, aminek a főoldalára látogatva rengeteg különféle helyről összebányászott információ tárul a kedves felhasználók elé. Van egy túlméretezett slider, alatta látható pár a legújabb termékek közül, alatta pár a felhasználónak testreszabottan ajánlott termékekből, láthatóak az akciós termékek, fent a sarokban a kosár tartalma, hoverre annak tartalma, a keresőben pötyögve pedig pár pillanat alatt tudunk keresni az összes termék közül, a megjelenő legördülőben. Ezek még annyira nem is kacifántosak, de ha ellátogatunk pl. a rendeléseinkhez, akkor a felületen elég sok elem megmarad, viszont bejönnek még az eddigi rendeléseink is. A lényeg, hogy egyik ezeket a táblákat használja, a másik fele azokat és mindegyik elég komplex lekérdezések árán fog nekünk valami választ adni. Ezt megcsinálhatjuk egy böszme webalkalmazás formájában, vagy szétdarabolhatjuk azt logikailag elkülöníthető részekre.

> Ne feledjük, hogy microservice-ek esetében az adott service-t elméletileg akármilyen nyelven implementálhatjuk, hiszen standard úton (REST, queue, stb.) kommunikál a többi service-el, ez lehetőséget biztosít, hogy a célra leginkább alkalmas nyelvet válasszunk és pl. ne erőltessünk non-blocking dolgokat egy php-re 🙂

[![magento](assets/uploads/2016/03/magento.png)](assets/uploads/2016/03/magento.png)

Amennyiben fel akarjuk darabolni, akkor arra mindenképp figyelnünk kell, hogy két service ugyanazt az adatforrást ne piszkálja. Tehát szükségünk lesz egy OrderService-re, amiből az eddigi rendeléseket le tudjuk kérni. Kelleni fog még egy ProductService és InventoryService, amiből a termékeket és azok raktárkészletét lehet lekérni. Kelleni fog az AccountService, amiből a userhez tartozó dolgokat kérjük le, meg nem árt egy CartService, mert a kosár tartalmát db-ben tároljuk, hogy később tudjuk küldeni az idegesítő leveleket a kosárban felejtett dolgokról.

Na most ha ezeket különmozgatjuk, akkor az több kérdést is felvet. Az első az, hogy mégis hogy fogják ezek megtalálni egymást? Felhőről beszélünk, ahol az isten tudja melyik IP-n és porton található az adott szolgáltatás. A másik probléma, hogyha ezek pl. REST-en kommunikálnak, ez betyársok kérés, na meg ki fogja ezt indítani? Erre jött létre az ún. API gateway, ami egy ponton összefogja ezt a szálat. Az egyes klienseknek, pl. angularJS-nek vagy mobilapplikációnak nem kell tudnia, hogy melyik service mit is csinál, sőt! Alapvetően el sem szabadna őket érnie közvetlenül. A másik pedig, hogy kik és hol autentikálnak? Egy központi OAuth-ot hívogatna mind, vagy a JWT tokent verifikálnák? Ezt is megoldhatjuk ennél az ún. API gateway-nél (vagy egy külön service-ben, az ún. access pointban, a'la Spotify). Na most ha szétcincáljuk, akkor valahogy így fog kinézni a dolog:[![apigateway](assets/uploads/2016/03/apigateway.png)](assets/uploads/2016/03/apigateway.png)

Na most akkor mi is történt? Szétdaraboltuk a service-eket és mindet egy API gateway-en engedtük át. Ez lesz a ami a kliens és a kérés alapján eldönti, hogy mely service-eket milyen módon is hívjon meg (ha egyáltalán meghívja, ne feledjük az autentikációt), lehetőleg több szálon, hogy haladjon is a dolog. A visszatérő válaszokat csokorbafogja és visszaadja a kliensnek, mégpedig úgy, hogy annak a lehető legjobban megfeleljen az. Tehát ha a mobilon nem jelenítünk meg valamit, akkor a választ a mobilokra úgy alakítjuk, hogy ne terheljük feleslegesen az amúgy is lassú WAN-t. A kliensek ezután csak 1 URL-t kell ismerjenek, az API gateway-ét.

A hátránya persze ennek is az, hogy egy újabb modult kell létrehozni, komplex logikával. Valamint plusz egy node, plusz hálózati válaszidőt jelent, de ez általában elhanyagolható.

> Na és az API gateway honnan fogja tudni, hogy merre kolbászolnak a törpék és hányan vannak?

Bizony bizony, ez továbbra se oldotta meg azt a problémát, hogy bizony a felhő.. az felhő. Nos a fenti probléma megoldása az ún.

**Service Registry**

Tegyük fel, hogy a service-ink közül a legtöbb ismeretlen helyen van, azonban van pár, amik fix helyen csücsülnek. Ezek lesznek az ún. service registry-k. Amikor fellövünk egy service-t, az valamilyen azonosítóval beregisztrál ide és időnként a registry megkérdezi, hogy minden oké-e, vagy az adott service lehalt.

> Persze maga a registry is lehalhat, ennélfogva ebből is kell több példányt futtatni, hogy mindig legyen ami kiszolgál.

[![registry](assets/uploads/2016/03/registry.png)](assets/uploads/2016/03/registry.png)

Na akkor mennyiben változik a dolog az előbbiekhez képest?

Elindítjuk először a registry-ket, ezek ugye alapból clusterezve. Amikor a többi service életre leheljük, azok becsekkolnak a registry-ben, ezáltal tudatva, hogy igen, ők ezen az IP-n és porton ülnek és ez a nevük. A kliens (vagy épp az említett API gateway) küldd egy kérést a router felé, a Service I után kutatva. A router lekérdezi (ha nem tette már meg előbb és igényesen becachelt), hogy hol találja a Service I-el azonosított service-eket. Ezután ennek a segítségével a megfelelő helyre továbbítja a kérést és még akár load balance-olni is tudja azokat.

Erre már vannak nagyon jó eszközök:

- [Eureka](https://github.com/Netflix/eureka/wiki/Eureka-at-a-glance)
- [Apache Zookeeper](http://zookeeper.apache.org/)
- [Consul](https://consul.io/)
- [Etcd](https://github.com/coreos/etcd)

A microservice-ekről egyelőre ennyit, remélem tudtam valami újat mondani!