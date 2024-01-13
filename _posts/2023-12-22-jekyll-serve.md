---
title: 'Jekyll serve'
date: '2023-12-22T13:22:41+01:00'
author: tacsiazuma
layout: post
permalink: /2023/01/09/az-elso-it-munkahely-4-resz/
image: 'assets/uploads/2024/01/jekyll-post-image.jpg'
featured: true
categories:
    - Egyéb
    - Fejlesztés
tags:
    - jekyll
    - wordpress
    - migration
---
A letscode.hu tartalma sok helyről sokféleképpen volt már kiszolgálva. Volt már hazai VPS-en, AWS-en, konténerben és anélkül. 100%-ban wordpress-el, wordpress és laravel kombinációjával, majd ismét wordpress-el. Mára (igazából már kb 4 éve érik a gondolat) viszont eljött a statikus oldal ideje. Ennek több oka is van, de ne rohanjunk ennyire előre, hanem nézzük meg, hogy miért és hogyan jutottunk el ide.

## Wordpress

Amikor valaki blogot kezd, akkor szinte biztos, hogy a wordpress mint olyan felmerül. Nem volt itt sem más a helyzet. A feladatát ellátja, nem kell webshoppá alakitani, nem kell temérdek plugin, csak legyen valami ami a tartalmat kezeli.

## Wordpress + Laravel 

Egy hibája volt a dolognak, mégpedig az, hogy lassú, emiatt nem sokkal később jött az ötlet, hogy mi lenne, ha az admin felületet továbbra is a Wordpress szolgálná ki, ellenben az olvasói felületet valami más, pl. az akkoriban is népszerűnek számitó Laravel. 

Ehhez természetesen a Wordpress tartalom megjelenitési logikáját át kellett ültetni Laravelbe, a JS és CSS kiszolgálását optimalizálni, hogy az oldal sebességét élvezhetővé tegyük. Itt jöttek be olyanok is a képbe, hogy a képekből SVG placeholderek legyenek generálva, ezzel is gyorsitva az oldal betöltését. 

## Wordpress megint

Az admin felület azonban ettől még nem lett gyorsabb, de ami a legnagyobb baj, hogy az eredeti blog kinézetét habár át lehetett ültetni blade templatekbe, de ha egy teljesen más témát akart az ember az oldalnak, akkor bizony azt teljesen nulláról kellett megirni, nem voltak kész templatek. Igy visszakanyarodtunk az eredeti ötletre, miszerint legyen Wordpress. Ekkor már nem egy hazai VPS-en futott, hanem AWS-en, ami kicsit megkönnyitette az ottani szolgáltatások használatát. Igy lettek a képek S3-ra, pontosabban CloudFrontra kihelyezve, ezzel is levéve némi terhet az oldalt kiszolgáló szerverről. Persze más, az oldal sebességét javitó pluginek is használatba kerültek, igy a visszatérés nem járt fájdalmakkal, legalábbis felhasználói szemszögből.

Azonban továbbra is kellett az egész mögé egy webszerver, PHP, adatbázis. Ezekhez pedig foglalkozni kell az adott szerverrel, frissiteni azt, ami - bárhogy is nézzük -, egy nyűg.

## Jekyll

Igy jutottunk el a mostani állapothoz, ami egy teljesen statikus HTML oldal, amit a jekyll nevű szoftver generál le nekünk. 
Ahhoz, hogy legyen tartalom, amit a jekyll által HTML-é tudunk alakitani, exportálni kell az adatbázisból. Erre létezik egy plugin, a Jekyll Export plugin, ami egy jókora zip fájlt eredményez. Ez azért van, mert nem csak a szöveges tartalmat, de a képeket is bele kell forgassuk az oldalba annak érdekében, hogy megfelelően jelenjen meg. Ezt a zip fájlt letöltjük, kicsomagoljuk és szimplán odamásoljuk, ahol az imént inicializáltuk a jekyll projektünket. Persze itt még voltak gondok a beégetett URL-ekkel és hasonlókkal, itt a search/replace volt a megoldás.

## Mediumish theme

Persze az alap Jekyll kinézet nem valami megnyerő, főleg a korábbi Wordpresses Newshpere template után. Az elején elkezdtem átmigrálni a témát is jekyllre, feldarabolni azt, layoutot kialakitani, de temérdek munka lett volna és nem akartam sok energiát belefektetni, hiszen a lényeg pont a "just works" filozófia volt. Igy jött a témaválasztás: Valami egyszerűbbet akartam, amin a lényeg látható, nincs benne rengeteg CSS és JS, animált elemek és hasonlók, hiszen egy szimpla blogoldalról van szó. A mediumra hajazó templatere esett végül a választás, ingyenes is, egyszerű is. Pár apróságot kellett rajta módositani, például magyaritani kellett itt-ott.
Amiket még meg kell oldani, azok az egyes thumbnailek generálása, esetleg image preloadert alkalmazni, hogy csökkentsük a használt sávszélességet.

## Lunrsearch

Na de mi a helyzet a kereséssel az oldalon? Backend nélkül hogy lehet ezt megoldani? Nos erre egy teljesen kliensoldali megoldás van használva az emlitett templateben, igaz nem éppen hatékonyan, de erre majd visszatérünk. A lunr egy solr-ra hajazó 100%-ban JavaScript alapú kereső, ami futhat böngészőben vagy éppen a szerveren is. Esetünkben csak böngészőben fut, a trükk az, hogy a jekyll segitségével generálva van egy js fájl, amiben gyakorlatilag a dokumentumok belekerülnek, ez lesz indexelve, majd a keresés ezt az indexet használja. 

## Service worker

Egy gond van vele, hogy az indexelés bizony lassú. Pár bejegyzésnél ez még nem vészes, de több száz esetében másodpercekig tart. Sajnos JavaScriptről lévén szó, ilyenkor az oldal teljesen megakad, ami nem a legjobb UX szempontból. Erre szerencsénkre van megoldás, még akkor is , ha a JavaScript eredendően egy szálon működik. A trükk az, hogy egy másik szálon futó JavaScriptnek átdobjuk az indexelés és a keresés feladatát is. Erre lesznek jók a service workerek, amik egy másik szálon futnak. A két folyamat között lehetőségünk van üzeneteket küldeni, igy az indexelést, sőt, a komplett keresés felelősségi körét át tudjuk adni.
(Ha bárkit érdekel az, hogy ez mégis hogy lett megvalósitva, akkor utólag bedobom ide)
Ez persze limitálja a lehetőségeinket, régi böngészőket nem fog támogatni, de aki fejlesztésre adja a fejét és a blogot olvasná, nem egy régi böngészővel látogat meg minket.

## Disqus

Kommentekre már nagyon régóta nem a Wordpress komment motorját, hanem egy külső szolgáltatást használtunk, mégpedig a disqus-t. Mivel a bejegyzések URL-e ugyanaz maradt az exportálás után, ezért a korábbi kommentek is megmaradtak, igy ezzel már nem volt dolgunk.

## Hosting

Na de a statikus oldalt is hostolni kell ám valahol, nemde? De bizony és ez a github pages-t jelenti az esetünkben. Minden user kap egy usernév.github.io-s github pages lehetőséget, 100Gbyte havi forgalmi kerettel. A github pages setuphoz még csak github workflow-t se kell létrehozzunk, adott branch adott mappájára futtatnak egy jekyll build-et és az igy kapott kimenet lesz a webrootból kiszolgálva. Ha saját custom domaint akarunk, akkor egy CNAME nevű fájlt kell elhelyezni a repoban, ami saját domainünk nevét tartalmazza, kis DNS record szerkesztgetés, utána már megy is. Mivel korábban volt már a letscode.hu blog DDoS támadás alatt, ezért a CloudFlare ismét bekerült elé, még ha nem is okoz gondot a github pages hostingjának, jó lenne ha a 100Gbyte limitet nem pörgetnék ki a rosszakarók.

## Társszerzők

Akik korábban is besegitettek (vagy szeretnének a jövőben), hogy tudnak ezek után kontributálni? Látogassanak el a [github oldalra](https://github.com/letscodehu/letscodehu.github.io) és nyissanak egy PR-t.

És bumm, igy mentesültünk a szerverüzemeltetés, Wordpress frissitgetés minden problémájától.

