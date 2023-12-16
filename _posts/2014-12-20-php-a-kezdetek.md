---
id: 29
title: 'PHP &#8211; A kezdetek'
date: '2014-12-20T20:47:09+01:00'
author: tacsiazuma
layout: post
guid: 'http://iacwebshop.hu/?p=29'
permalink: /2014/12/20/php-a-kezdetek/
dsq_thread_id:
    - '3345807634'
    - '3345807634'
categories:
    - PHP
tags:
    - apache
    - kezdet
    - mysql
    - php
    - telepítés
    - xampp
---

A [PHP](http://hu.wikipedia.org/wiki/PHP) egy általános szerveroldali szkriptnyelv, ami tökéletes dinamikus weboldalak készítéséhez.

#### Miért pont a PHP?

Ha valaki a webfejlesztés sötét bugyraiba kíván ereszkedni, akkor több eszköz is rendelkezésére áll-e célra. Ezen eszközök egyike a PHP, mely viszonylag könnyen megtanulható, ezáltal komolyabb előképzettség nélkül is lehet benne korán eredményeket elérni.

#### A kérdés az, hogy milyet.

A legtöbb, nem PHP fejlesztő igencsak megveti a PHP nyelvet, ugyanis ez a lazaság sok olyan kódot eredményezett, ami sokak szemét sérti. Biztonsági szempontból az internet a programnyelvek Mordorja, mivel rengeteg ponton elbukhat a történet és az unatkozó tizenévesek sem restek, hogy random módon teszteljék a lehetséges biztonsági réseket. A probléma ott volt, hogy ebbe a veszélyekkel teli környezetbe kerültek ki olyan kódok, amiket még bőven egy sandboxban kellett volna próbálgatni. Félreértés ne essék, senkit nem akarok lebeszélni a nyelv elsajátításáról, csupán szeretném felhívni a figyelmet arra, hogy az interneten ólálkodók nem válogatnak.

Hogy egy példával szolgáljak: Mikor élesbe kihelyeztem a szerveremet, a frameworkömben volt egy statisztikai script, amit feltuningoltam, így logolta az egyes lekérdezések környezeti változóit. Amikor felkerült a netre a shellshock nevű biztonsági rés, rá pár órára már több oldalról is bepróbálkoztak nálam az adott useragent stringel. Arról nem is beszélve, hogy mielőtt átállítottam az SSH-m portját, a fail2ban nevű program logjába 5 percenként kerültek új bejegyzések, valamint végigjárták az összes lehetséges wordpress config/setup és hasonló fájlt.

Tehát akkor mégis miért választanánk ezt a nyelvet? Mert a világ vezető weboldalai is ezen a nyelven futnak, valamint a webszerverek döntő többsége mind a mai napig PHP-t futtat, ezért a PHP fejlesztőkre még sokáig szükség lesz.

#### Mire lesz szükségünk ahhoz, hogy nekiessünk?

Mivel ez egy szerveroldali nyelv, ezért egy webszervert kell fellőni hozzá. Ez a webszerver esetünkben az Apache lesz. Hozzá fognak beérkezni a HTTP kérések, és ő fogja továbbítani azt a PHP-nek feldolgozásra, majd visszaadja a generált kimenetet. A PHP pedig a MySQL adatbázissal lesz kapcsolatban. Léteznek egyéb webszerver és NoSQL megoldások is, de azoknak a tárgyalása nem fér e poszt kereteibe.

A legegyszerűbb megoldást ezen hármasra Windows környezetben az [XAMPP](https://www.apachefriends.org/hu/) stack nyújtja ( Linux környezetben pedig a [LAMPP](https://www.apachefriends.org/hu/)). Ennek telepítését és konfigurálását a következő posztban taglalnám.