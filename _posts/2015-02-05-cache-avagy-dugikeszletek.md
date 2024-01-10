---
id: 230
title: 'Cache, avagy a dugikészletek.'
date: '2015-02-05T10:28:17+01:00'
author: tacsiazuma
layout: post
guid: '{{ site.url }}/?p=230'
permalink: /2015/02/05/cache-avagy-dugikeszletek/
dsq_thread_id:
    - '3487379324'
    - '3487379324'
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
tags:
    - cache
    - invalidation
    - memcache
    - php
    - ttl
---

Ahhoz, hogy igényesen elmélyüljünk a gyorsítótárazás mikéntjében, első körben tisztáznunk kellene azt, hogy pontosan mit is értünk cache alatt.

> Gyorsítótárazásnak nevezzük azt az átmeneti információ tároló elemet, aminek az információ elérés gyorsítása a cél. Ez a gyorsítás lényegében azon alapul, hogy a gyorsítótár elérése gyorsabb, mint a hozzá tartozó gyorsítandó elemé, így ha az adott információ már jelen van a gyorsítótárban (mert már valaki korábban hivatkozott rá és odakerült), akkor innen nyerjük ki, nem pedig a lassabb gyorsítandó területről.

Hogy egy egyszerű példával éljek. Főzünk egy kávét és azt beleöntjük egy nagy bögrébe, majd odavisszük a számítógépünk mellé és leülünk. Amikor kávéra van szükségünk nem kell kigyalogolni a konyhába, csak kinyújtani a kezünket. A kávé elérési idejét jelentősen lecsökkentettük azzal, hogy egy gyorsabb elérésű átmeneti tárolóba helyeztük azt. Real life caching! 🙂![](http://www.hiddenwebgenius.comassets/uploads/2012/04/pc-coffee.jpg)

Webalkalmazásaink szempontjából hol is lehet az információ? Nézzük őket sorba az elérés sebessége alapján

Másik szerveren, külső API. - Aki valaha megnyitott egy oldalt a böngészőjében az pontosan tudja miről is van szó, csak ez szerverünkön láthatatlanul történik, ellenben ugyanúgy időbe telik elküldeni a kérést, annak odaérnie, a választ legenerálnia az ottani szervernek és annak visszaérnie. Itt az elérési sebesség tekintetében (jobb esetben tized)másodpercekről is lehet szó, a szerver földrajzi helye és terheltségétől függően.

Localhost, fájlrendszer: Itt simán fájlokba van valamilyen módon rendezve az adatunk, így szimplán a HDD-nk (netán SSD-nk) sebességétől függ az elérés ideje.

SQL adatbázis: Itt az adatok ugyan a merevlemezen vannak, de indexelve, ráadásul az SQL adatbázisunk is használ egy saját alkalmazás szintű gyorsítótárazást, így ennek elérési ideje jobb, mintha szimplán csak fájlokból olvasnánk az adatainkat.

Memória (NoSQL megoldások, memcache) : Itt az adatokat a memóriában tároljuk egy külön szolgáltatásban, amivel socketeken keresztül kommunikálunk, így az elérési ideje közel azonos a kódunkban deklarált változók elérésével.

A sor végén a leggyorsabb elérés pedig az általunk deklarált változók közvetlen elérése.

> Mi célt szolgál a gyorsítótárazás? Hol lehet ezt használni?

Nos a dolog akkor lehet hasznos, mikor egymás után többször ugyanazt a tartalmat/értéket jelenítjük meg. Tehát amikor A felhasználó rákattint B weboldalra, akkor a B weboldalon bizonyos tartalmak megjelenítéséhez elérjük a fenti források valamelyikét, esetleg többet is és egy gyorsabb helyen letároljuk. Ezután mikor C felhasználó is rákattint, akkor már nem kell adatbázisba nyúlni, külső API-t piszkálni, hanem pl. memóriából kicsapjuk neki a tartalmat. Jogos lehet a kérdés, hogy egy dinamikus weblapnál, aminek a neve is árulkodik arról, hogy a tartalma változó, mégis hol van helye cachelésnek. A válasz:

> Mindenhol

Vegyük például ezt a bejegyzést. A WordPress barátunk ugye a dolgait adatbázisból nyeri, ahogy a bejegyzés szövegét is. Kiposztolom a dolgot, valaki rákattint, lehúzzuk SQL-ből a tartalmát, majd 1 perc se telik el valaki más is rákattint és újra lekérjük UGYANAZT a tartalmat, hiszen nem változott, nem írtam át. Miért nem tárolhatnánk inkább a memóriában, hogy amikor legközelebb valaki lekéri, akkor nanosecundumok alatt előteremtsük azt, javítva ezzel a user experience-t. Nézzünk inkább valami egyszerű példát a dologra PHP-ben.

```
class PostMapper {

private $cacheadapter, // ez a cache adapter osztályunk
$dbadapter; // ez pedig az adatbázis osztályunk referenciája

   public getPostById($id) { // az adott id-hez tartozó bejegyzést akarjuk lekérni
      if (!$cacheadapter->hasItem($id)) { // megnézzük, hogy van-e hozzá tartozó kulcs a cache-ben
        $post = $dbadapter->getRecord($id); // ha nincs, akkor lekérjük az adatbázisból
        $cacheadapter->setItem($id, $post); // és hozzáadjuk a cache-hez
        return $post; // aztán visszaadjük
      } else 
          return $cacheadapter->$getItem($id); // ha a cache-ben megtalálható, akkor visszaadjuk azt
    }
}
```

A fenti példa egy nagyon leegyszerűsített változata annak, hogy is működik a gyorsítótárazás. Ha valaki zavart érez az Erőben a kód láttán, az jól teszi.

> Mi van akkor, ha módosul az adat, de mi a gyorsítótárazott verziót használjuk?

Nos akkor <del>megszívtuk</del> elkezdhetek beszélni a TTL-ről (Time To Live), amit a gyorsítótárban tárolt kulcsokhoz társíthatunk. Ez egy élettartamot jelöl, ami után az adott kulcshoz tartozó érték érvénytelenítésre kerül. Ezt nevezzük cache invalidationnek és ez a gyorsítótárak felépítésének legnagyobb problémája, ugyanis sosem tudni hogy egy adott adat mikor módosul. Ha túl nagy értéket adunk meg, akkor elavult adatokat használhatunk, ha túl kicsit, akkor pedig feleslegesen járatjuk a gyorsítandó adattárolókat és a hatékonyságunk csökken.

#### Touch-é

A cachelés tekintetében 5 alapműveletet tartunk számon.

SetItem - Kulcs/Érték beállítása

HasItem - Szerepel-e az adott kulcs a gyorsítótárban

GetItem - Adott kulcshoz tartozó érték kinyerése

RemoveItem - Adott kulcsot töröl a gyorsítótárból

Touch - Az értéket békénhagyja, csak a kulcs létrehozásának dátumát módosítja az aktuális időpontra, ezáltal megnyújtjuk a kulcs élettartamát, mert a TTL újra elkezd ketyegni.

Az egyik megoldás a fenti problémára az az, hogy viszonylag rövid élettartamú kulcsokat hozunk létre, de periodikusan ellenőrízzük azok valódiságát és amennyiben a tartalmuk nem változott, akkor csak "megpiszkáljuk" őket és ezzel megnyújtjuk az élettartamukat. A másik megközelítés az, hogy örökélettel <del>és ingyen sörrel </del> ruházzuk fel az adott kulcsot és az értékét akkor módosítjuk, ha a hozzá tartozó gyorsítandó elem is módosul. Pl. mikor módosítom ezt a posztot, akkor invalidálhatom a hozzá tartozó kulcsot, netán módosíthatom annak tartalmát. Így a gyorsítótár is jól jár, az adatbázis is és nem kell attól félnem, hogy elavult adatokat szolgáltatok.

Ellenben most nézzünk egy szinttel feljebb és vegyük át, hogy hol is történhet gyorsítótárazás szerver-kliens viszonylatában.

Alkalmazás: Ez az, amire nekünk a legnagyobb ráhatásunk lesz a későbbiekben, amiről a fentebb is beszéltem.

SQL és egyéb adatbázisok: Ezek is tartalmaznak egy cache layert, de ebbe most nem mennék külön bele.

Szerver: Konkrét cache-lést nem végez, ellenben segíthet a kliensoldali cache-lésben. Gondolom senkinek se kell bemutassam a Chrome Ctrl+Shift+Kisbalta kombinációval előcsalogatható developer paneljét. Ennek a network fülén lehet látni az egyes lekéréseket és a rájuk kapott választ. Mikor küldünk egy lekérést az xy.com-ra, akkor az nem csak egy kérés-választ fog jelenteni. Minden egyes kép, stylesheet, script fájl, favicon-hoz új kérést indít a kliens a szerver felé, amikre 200 OK-val reagál és a response body-ban ott lesz a haszonanyag. Viszont ha szemfülesek vagyunk, akkor láthatunk 304 Not modified válaszkódot is.

> 304 Not modified? Kit érdekel, hogy not modified?

A drágalátos kliensünket. Ugyanis a kliens is végez gyorsítótárazást, ez az amit a csúnya gonosz Windows alatt a temporary internet files-ban rejteget és gigákra hízik, ha nem figyelünk. Amikor egy lekérésre megérkezik a válasz, akkor a böngésző azt elmenti a saját cache-ébe.

> Nem a fájlnév alapján, hanem a lekérés URL-jéhez kapcsolódóan. Így hiába van pl. minden oldalon, amit meglátogatunk ugyanaz a jquery-1.11.1.min.js fájl, a böngésző számára ezek különbözőek, de erről majd a CDN-ek tárgyalásakor.

Amikor lekérést küldünk a szerver felé, az megjegyez bennünket, hogy már jártunk ott és mikor ismét küldjük a lekérést, akkor tudja, hogy bizonyos fájlokat már letöltöttünk, bizonyosakat pedig nem. Amit letöltöttünk, arról küldhet 304-es választ, a konkrét tartalom nélkül, így a böngészőnk a saját gyorsítótárából (a merevlemezünkről) fogja betölteni azt. Viszont a szerver válaszát ígyis-úgyis meg kell várjuk, hiszen csak akkor derül ki, hogy a helyi fájlt vagy a szerver válaszában érkezőt fogjuk-e használni. Ellenben egy 22x bájt hosszúságú válasz könyebben kiszolgálható, mint egy 400kByte-os .js fájl.

Proxy: Ez egy közbenső szerver, ami több feladatot láthat el és ezen feladatok közé tartozik a gyorsítótárazás is. Vállalatoknál előfordulhat, hogy többen ugyanazokat a tartalmakat látogatják meg, így felesleges mindig újra és újra letölteni azt és ilyenkor a proxy szerveren keresztül haladó lekérések tartalmát maga a proxy fogja ideiglenesen tárolni és kiszolgálni számunkra, azok elévültségétől függően. Ennek a frissítésnek a gyakoriságát a webszervernél fejlécbe ágyazott META tagekkel tudjuk befolyásolni.

A következő cikkben kitérek az alkalmazásoldali lehetőségekre és azok buktatóira.
