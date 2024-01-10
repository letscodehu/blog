---
id: 734
title: 'Dokkolnám, dokkolnám!'
date: '2015-10-25T21:29:10+01:00'
author: tacsiazuma
layout: post
guid: '{{ site.url }}/?p=734'
permalink: /2015/10/25/dokkolnam-dokkolnam/
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
    - '4258774730'
    - '4258774730'
categories:
    - DevOps
    - Egyéb
tags:
    - build
    - container
    - docker
    - holes
    - lxc
    - run
    - security
    - ship
---

<figure aria-describedby="caption-attachment-782" class="wp-caption aligncenter" id="attachment_782" style="width: 515px">[![5766236_600x400](assets/uploads/2015/10/5766236_600x400.jpg)](assets/uploads/2015/10/5766236_600x400.jpg)<figcaption class="wp-caption-text" id="caption-attachment-782">A konténerek használata sok mindenben segítségünkre lehet...</figcaption></figure>

A múltkori vagrantos cikkemben bemutattam, hogy is lehet egy fejvesztési környezetet létrehozni a saját gépünkön a Virtualbox vagy VmWare-re épülő Vagrant segítségével. Ez a fajta virtualizáció elérhető az összes platformon, így segítségül szolgálhat a fejlesztők számára. Ha ezt át szeretnénk ültetni a szervereinkre, mert ráeszméltünk az előnyeire, akkor előbb-utóbb rájövünk, hogy ez a megoldás nem az igazi, ha pl. az alkalmazásainkat akarjuk deployolni ide, mert lassú és habár a host rendszertől erősen elszeparált, mégsem erre a célra való (habár kombinációról majd szó lesz a későbbiekben).

A virtualizációnak egy másik, sokkalta kernelközelibb módját az ún. LXC container-ek jelentik. Ezek jelenleg csak linux rendszereken elérhetőek, de tekintve mennyire felkapottá váltak az elmúlt időszakban, a windows is lépni fog hamarosan.

A lényege annyi, hogy létrehozunk a linux rendszeren belül <del>alrendszereket</del> elszeparált szekciókat, ún. névterek, chroot és control group-ok segítségével. Ezek a névterek szeparálják majd el a processeket, usereket, stb. Ennélfogva egy viszonylag (erre majd még kitérünk :D) jól elszigetelt alrendszert hozunk létre, egy futtatókörnyezetet alkalmazásunk számára.

Na és itt a lényeg, itt egy-egy alkalmazásunkat (és akár annak függőségeit) akarjuk beburkolni egy ilyen konténerbe. Könnyen mozgatható, le- és újraindítható, akárcsak a való életben a konténerek. Pl. létrehozhatunk egy konténert a webszerverünknek, egyet az adatbázisunknak, egyet a Redisnek, vagy épp csomagolhatjuk őket egybe, stb. Nem kell azzal törődnünk, hogy esetleg azok bármilyen módon összeakadnának. Egymástól és a hoszt rendszertől is elszeparáltak és egy plusz biztonsági réteget nyújtanak a támadásokkal szemben.

Ezen low-level LXC konténerekre épül a [Docker](https://docs.docker.com/linux/started/), ami lehetővé teszi, hogy ezek a konténerek különböző linux rendszerek közt is biztonságosan hordozhatóak legyenek. Egyszóval elfedi a rendszerspecifikus dolgait az LXC-nek, ráadásul ingyenes is. Mégis mi kell még, zuhanjunk neki, mert semmi se lesz belőle!

Első körben le kell rántanuk wget-el a telepítőt és futtatni (sudo jogosultság nem árt):

```
$ wget -qO- https://get.docker.com/ | sh
```

Ha ezzel megvolnánk, lessük meg, hogy működik-e a dolog.

```
$ docker run hello-world
```

Ez, mivel nem találja lokálisan, lerántja nekünk a hello-world nevű image-et egy központi registryből és utána szimplán elindítja azt. Ez leteszteli, hogy a dockernek megvannak a megfelelő privilégiumai a rendszerben, <del>nem b\*szódott el a switch</del> látja a netet kifelé, stb.

#### Image-et? Nem arról volt szó, hogy ezek konténerek és nem virtual machine?

Az image-eket úgy képzeljük el, mint írásvédett template-ek. Ezek azok, amiknek a "példányosításával" jönnek létre a containerek, ezekben futtatunk bizonyos parancsokat, különböző paraméterekkel.

Ezeket az image-eket tudjuk letölteni az ún. registry-ből. A Docker Hub is egy ilyen registry. Image-eket magunk is összeépíthetünk, majd erről is lesz szó. Rengeteg ilyen már előregyártott imaget találunk a neten, így nem kell aggódni, de a már építetteken is tudunk dolgozni persze. Ilyen image lehet pl. egy ubuntu alaprendszer, egy apache + php, üres wordpress, stb.

Az ezekből példányosított konténereket elindíthatjuk, leállíthatjuk, mozgathatjuk, törölhetjük.

Most egyelőre ugorjuk át az advanced részt, ahol mi magunk építjük fel az imageket, és nézzük mi a helyzet a containerek futtatásával?

#### Docker? Run![![contfail](assets/uploads/2015/10/contfail.bmp)](assets/uploads/2015/10/contfail.bmp)

Amikor egy konténert akarunk elindítani, akkor a docker run paranccsal tudjuk megtenni azt.

Ennek a parancsnak több paramétere is lehet. Mivel minden konténer egy image-ből jön létre ezért a példányosítandó image nevét mindenképp át kell adni. A többi paraméter már opcionális. Akkor most próbáljuk ki a következőt:

```
docker run debian
```

Az alábbi parancs futtatása esetén a docker megnézi, hogy a lokális image-ek közt megtalálható-e a debian nevű, ha nem, akkor egy docker pull paranccsal a háttérben lehúzza azt (illetve a verziókövető rendszerkhez hasonlóan egy verziót/tag-et belőle.. jelen esetben a latest tag-et.) egy registry-ből, és utána példányosítja azt, majd elindítja. Viszont a terminalban nem történik semmi. Pár másodperccel később visszakapjuk a shellt és ennyi. Mégis mi történt?

A futó konténereinket a docker ps nevű paranccsal tudjuk kilistázni. Mivel a host rendszer szempontjából egy ilyen konténere egy process (és persze az általa fellőtt childprocess-ek), ezért a ps paraméter. Nos a helyzet az, hogy a parancs egy futó konténert sem lát.

#### Nos, mégis hogy történhet ez?

[![whyudodis](assets/uploads/2015/10/whyudodis.png)](assets/uploads/2015/10/whyudodis.png)

Nos ahhoz, hogy megválaszoljuk a fenti kérdést, meg kell vizsgáljuk, hogy hogy is épül fel egy image. Az image egy ún. Dockerfile instrukciói alapján épül fel. Ebben döntjük el, hogy mely könyvtárakat emeljük be, mit futtatunk a konténer belsejében a run parancs paramétereitől függetlenül, környezeti változókat kezelünk, stb. A hello-world image igazából csak kiechozott pár sort és utána le is állt. A debian image pedig igazából csak a debian adott verziójának eszközkészletét bocsájtja rendelkezésünkre. Tehát a konténeren belül ha meghívunk egy apt-get-et, akkor azt felismeri majd. Viszont nem indít el semmit, ami fusson a konténerben, ez a feladat ránk hárul. Persze léteznek olyan konténerek, amik már ezt a feladatot elvégzik helyettünk, mert egy adott céllal jöttek létre, pl. Jenkins, Gitlab, Redmine, PostgreSQL. Ezeknél a run parancsnak nem szükséges paraméterként átadni a futtatandó állományt, mert itt az alkalmazást már beleépítették az image-be.

Akkor most próbáljunk hozzáférni a terminálhoz a konténerünkben! Ezt nem SSH-val fogjuk megoldani, hanem meghívjuk a konténeren belül a /bin/bash-t.

```
docker run debian /bin/bash
```

Ismét nem történt semmi, viszont nem dobott hibát, hogy nem találná a bash-t, ez már valami! A probléma a következő. Oké, hogy mi elérjük a bash-t, de nincs hozzákapcsolt terminál, amivel bepötyöghetnénk a parancsokat. Ezt a -t paraméterrel meg tudjuk oldani. Vigyázzunk, mert a parancsok a következőképp kell felépüljenek:

```
docker run [paraméterek ... ]  <image-neve> <futtatandó parancs>
```

Ennek megfelelően:

```
doker run -t debian /bin/bash
```

Éééés.. ott a terminál! Na jó, eddig is ott volt, csak nem az ami nekünk kellett, de most láthatjuk, hogy root@valamihash:/# áll előttünk. A hash ez esetben a konténer azonosítója, mivel a docker minden konténert egy sha1 hash-el azonosít. Erre ráhúzhatunk egy nevet még a --name paraméterrel, hogy könnyebben azonosíthassuk azt. Viszont mikor beírunk valami parancsot a terminálba és tolunk egy ENTER-t, az úgy működik, ahogy az enternek működnie kell egy szerkesztőben. Új sort nyit. **Na valami mégsincs rendben.** Egy Ctrl+C-vel lépjünk ki. Ez leállítja a konténert és visszakapjuk a host shellt. A helyzet az, hogyha azt szeretnénk, hogy a parancsainkat interaktív módban tudjuk kiadni, akkor az -i, azaz --interactive paramétert és át kell adjuk.

> Amikor elindítunk egy konténert, akkor ugye példányosítja az image-ből, lefuttatja, amit kell és utána leáll. Viszont mi történik a leállított konténerekkel? Gyűlnek és gyűlnek. Az nem fenyeget, hogy a SHA1 hash összeütközzön, de azért nem árt tisztán tartani a dolgokat. Ennélfogva az olyan konténereket, amiket nem szándékozunk újraindítani, az --rm paraméterrel, vagyis autoremove-al indítjuk. Ekkor amint leáll a konténerünk, a docker feltakarít helyettünk.

Természetesen ezen paraméterek ( i és t) összefűzhetőek, így a következő próbálkozás ez lesz:

```
docker run -it --rm --name teszt debian /bin/bash
```

Na most a fenti parancs a teszt nevet adja a konténerünknek, ezáltal más konténereket érintő parancsokkal ezzel is tudunk rá hivatkozni (egyébként a hash első 7 karakterével, mint a git-nél), ha leáll a konténerek, akkor automatikusan törli azt, a debian image-et használja, amiben elindítja a bash-t és átadja neki a tty-t, mindezt interaktív módban. **Bumm! Magic!**

Ott van előttünk a terminál és szabadon garázdálkodhatunk a konténerünk belsejében. **How cool is that?[![t41zs](assets/uploads/2015/10/t41zs.jpg)](assets/uploads/2015/10/t41zs.jpg)**

Ha bepötyögünk egy ls-t, szépen kilistázza a könyvtárakat, amiket egyébként a gyökérben látnánk. Igazából nem is gondolnánk, hogy egy konténerben futunk, nemde? Eltekintve attól a randa hostname-től a prompt végén. Lépjünk ki egy exit-el és finomítsuk kicsit a parancsot.

```
docker run -it --rm --hostname letscode --name teszt debian /bin/bash
```

> A fenti parancs alapesetben ütközést okozna, ha létezne még a teszt nevű konténer. Viszont az --rm paraméternek hála az törlődött, így ez nem jelent most gondot.

Na most mindenki root-nak érezheti magát itt nálam 🙂 root@letscode:/#, áll a promptban. A támadó alapból nem is sejtené, hogy valahol máshol van, hogy kitört a webalkalmazásunkból, kihasználta a PHP/Apache sebezhetőségét és most teljhatalmú úr.. vagy mégsem.

> Mielőtt bárki hamis álmokba ringatná önmagát, a konténerek közel sem jelentenek 100%-os biztonságot. Rengeteg rést fedeztek fel, amiket szép lassan be-betömögetnek, de sok esetben nekünk is tennünk kell ez ellen.

Na de halmozzuk az élvezeteket. Nem hinném, hogy egy bash lenne minden vágyunk, sokkal inkább gondolnám, hogy valami webalkalmazást szeretnénk futtatni a konténerben. Ahhoz viszont először el kell érjük, hogy kívülről bele tudjuk oktrojálni a <del>kolbászkákat</del> szükséges fájlokat és elindítsuk azt. A következőkhöz szükségünk lesz egy php-t és apache-ot tartalmazó image-re. Ez lesz a **php:<span class="hljs-number">5.6</span>-apache.**

> Igen, ebből már van 7-es PHP-val felvértezett [verzió ](https://github.com/docker-library/php/blob/f751ba0b5b1753ff8486cccdc1c3354d3be49597/7.0/apache/Dockerfile)is!

Az alap parancs így nézne ki az eddigiek alapján:

```
docker run -it --rm --hostname letscode --name teszt php:5.6-apache
```

Ezzel viszont három probléma is van. Az egyik az, hogy jelen esetben nem interaktív módban szeretnénk futtatni az adott konténeret és a tty-re se lesz szüksége. Sőt! Szeretnénk, ha mindenképp a háttérben futna. Erre a -d paraméter ad lehetőséget, ami daemon-ként fogja futtatni az adott konténert.

A másik probléma az, hogy nem tudjuk elérni a fájljainkat a konténerből. Ezért azokat be kellene mountolni. Erre a -v paraméter lesz a tuti, amivel meg tudjuk adni, hogy melyik könyvtárat, a konténere melyik könyvtárába akarjuk becsatolni. Hozzunk létre egy könyvtárat, amiben legyen egy index.php, aminek a tartalma mindössze ennyi:

```
<?php phpinfo();
```

A harmadik problémát pedig az jelenti, hogy nem nyitottunk portot (na jó, igazából az image-ben nyitottak egy 80-ast, de jó, ha erre is ránézünk 🙂 ) Erre a -p paraméter lesz a megfelelő, ahol az első paraméter a hoszt rendszer portja, a második pedig a konténeré.

Így ha összerakjuk a run scriptünket (a következő részben átvesszük hogy lehet ezeket beleágyazni magába az image-be, hogy ne kelljen mindig beírogatni), az így néz ki:

```
docker run -d --rm --hostname letscode -v /konyvtar/a/php/scriptekkel:/var/www/html -p 8086:80 --name teszt php:5.6-apache
```

Ha ezt a parancsot lefuttatjuk, akkor a shellben csak a conténere SHA1 hash-ét látjuk majd, ez egy azonosító, amivel a docker ps parancsoknál tudunk rá hivatkozni. Ha beírjuk, hogy docker ps, akkor láthatjuk, hogy a konténerünk bizony most nem tűnt el abban a pillnyalatban, hanem ott fut a háttérben. Ha pedig rálesünk telnettel vagy bármilyen böngészővel a localhoston a 8086-os portra, akkor láthatjuk, hogy működik, megjelent a phpinfo, teljes valójában.

Első körben ennyit a konténerekről. A későbbiekben szó lesz a biztonságról, meg arról, hogy is lehet saját image-eket építgetni!
