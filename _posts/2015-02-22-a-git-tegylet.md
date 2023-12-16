---
id: 311
title: 'A git (t)egylet'
date: '2015-02-22T12:28:59+01:00'
author: tacsiazuma
layout: post
guid: '{{ site.url }}/?p=311'
permalink: /2015/02/22/a-git-tegylet/
dsq_thread_id:
    - '3537754562'
    - '3537754562'
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
    - Egyéb
    - Intermediate
tags:
    - control
    - distributed
    - git
    - system
    - version
---

Aki sokat nézegeti a programozói álláshirdetéseket, annak bizonyára ismerős lehet a verziókövető ![puf](assets/uploads/2015/02/puf-1024x682.jpg)rendszer kifejezés, ami vagy a követelmények vagy az "előnyt jelent" kategóriában, de igen gyakran szerepelnek az ilyen hirdetésekben. Ezek működéséről, használatáról lesz szó az alábbi cikkben, mégpedig a (szerintem) legelterjedtebb, a [git<del>t</del>](http://git-scm.com/) példáin át. A sorozat során szó lesz verziókezelési modellekről, valamint arról, hogy tudtok remote repository-t létrehozni a VPS-eteken és konfigurálni azt, hogy automatikusan frissítse az oldalatok forráskódját push-oláskor, de ne ugorjunk ennyire előre!

#### Mi is az a verziókövetés?

Aki dolgozott már csapatban egy adott projekten, verziókövetés nélkül, pl. Sambán keresztüli dev szerveren (igen, ez nem csak mítosz :D), annak ismerős lehet a probléma, hogy egyszerre hozzáfér mindenki a kódhoz, ide-oda módosítgatja azt és senki sem tudja, hogy ki hol és mibe nyúlt bele. Így ha egy F5-re (vagy épp compile-ra) behal a rendszer és nem látjuk, hogy mi a hiba oka, épp melyik fájl, akkor mehet a fejvakarás, hogy vajon melyik volt az az ügyes, aki elb\*szta ( blame the intern!!) és ami a lényeg, hogy hol?

Egy fokkal közelebb jár az igazsághoz az a módszer, ahol mindenki külön modulokon/projekteken dolgozik, így az ütközés esélye csökken, de továbbra se tudjuk nyomon követni a hibáinkat, így az össznépi fejvakarást elkerültük, de az egyéni fejvakarás továbbra is ott lesz.

#### Az ultimate megoldás: verziókezelés

> A verziókezelés alatt a több verzióval rendelkező adatok elérését értjük. Az egyes változtatásokat verziószámokkal vagy verzióbetűkkel követhetjük nyomon. - Wikipédia

A fenti idézet szépen néz ki egy szakdolgozatban, de nem biztos, hogy mindenki elsőre érti. A dolog lényege, hogy van egy (vagy több, az elosztott verziókezelők esetén) szerver, ami tárolja az adathalmazunkat (ez az ún. repository). Ez az adathalmaz tartalmazza az összes addigi verziót, amit mi létrehoztunk és ebből a különböző verzióhoz tartozó fájlokat el tudjuk érni.

Vegyünk egy példát. Töltsük le a [git](http://git-scm.com/downloads)-et, telepítsük azt és nyissunk egy terminált (windows alatt pedig a git bash-t, ami egy linux-szerű felületet biztosít a számunkra).

> A git egy elosztott verziókezelő, ami azt jelenti, hogy minden gépen létrehozhatunk egy ilyen repository-t, így mindenkinél ott lesz a teljes adathalmaz az összes verzióval, így offline körülmények között is tudunk dolgozni rajta, arról nem is beszélve, hogy minden ilyen repository egy-egy backup.

A példák a sokak által nem kedvelt terminálon keresztül mennek majd, de sok IDE rendelkezik pluginnel hozzá, így nem olyan macerás a munka vele, de erre majd kitérek később. Először is keressünk egy a projektünknek megfelelő könyvtárat, ahol pötyögjük be:

```
<pre data-language="shell">git init /path/to/project/
```

Ezzel inicializáltunk is egy lokális repository-t a gépünkön a megadott elérési úton. Ha ezután belenézünk a mappánkba, akkor láthatjuk is, hogy egy rejtett .git mappa létrehozásra is került.

> A git másik előnye, hogy csak a projekt gyökerében helyez el egy mappát, nem spammeli tele az összes könyvtárat, mint a... tudjátok melyik
> 
> **Update**: Időközben (potom 1 éve :D) javították az SVN-t.

Ez a repository még eléggé üres, hozzunk létre egy fájlt. Lépjünk bele a könyvtárba és hozzunk létre egy fájlt, vagy másoljunk ide bármit. Ez a könyvtár a mi úgynevezett working copy-nk, vagy munkamásolatunk, amin dolgozni fogunk.

A következő parancs, amit meg kell ismerni az a `git commit`. Ezzel tudjuk a módosításokat jóváhagyni, írjuk is be a terminálba, projektünk gyökerében:

```
<pre data-language="php">git commit -m "valamilyen hozzáfűzött leírás, szöveg. Enélkül nem enged commitolni"
```

Hoppá, valami nem kóser. Azt írta a rendszer, hogy nothing to commit. Ahhoz, hogy miért van ez, mutatnék egy ábrát, hogy megértsük hogy a projektünk fájljainak mi is a három fázisa.

<figure class="wp-caption aligncenter" style="width: 1203px">![](http://git-scm.com/book/en/v2/book/01-introduction/images/areas.png)<figcaption class="wp-caption-text">A Git fájljainak három fázisa</figcaption></figure>

A .git könyvtár maga a repository, itt tárolódik minden információ, nem éppen olvasható formában. Ami ide bekerült, az már biztonságban elérhető.

Amikor a projektünkben egy fájlt módosítunk, akkor az szimplán módosítva van, de a git még nem figyeli azt a fájlt, ekkor még a working directory-ban van, mint **modified**. Ahhoz, hogy figyelje, hozzá kell azt adjuk az index-hez (**staging area**), így amikor a commit parancsot végrehajtjuk, akkor az indexből lássa, hogy igen, ezt a fájlt is követni kell, nem csak egy Asztal Parancsikonja.lnk, ami véletlenül be lett húzva. Ehhez a parancs a `git add.<br></br>`

```
<pre data-language="shell"># ezzel hozzáadjuk a projektünkben szereplő összes fájlt az indexhez, de lehet egyesével is, lsd. dokumentáció
git add -A
```

Amint ezt megtettük, a `git commit` már működni fog és minden fájlunk jelenlegi verzióját felvittük a **repository**-ba. Akkor most nézzük meg, hogy ezek a verziók hogy is működnek.

Változtassunk meg egy fájlt, amit előzőleg hozzáadtunk az indexhez, majd commitoljunk, majd ismételjük meg ezt párszor.

> Jelen commitok a local repository-ba történnek rögzítésre, de majd később kitérünk a remote repository-kra is.

Tegyük fel, hogy a legutóbbi committal valamit csúnyán elszúrtunk és szeretnénk visszalépni egy előző revision-höz (ne tévesszen meg senkit a fogalom, ez verziót jelent), erre lesz a git checkout parancs.

A checkout kibányássza a working directory-ba (vagy a paraméterekben megadott helyre) a paraméterekben megadott revíziót. Amikor azonban ezt paraméterek nélkül tesszük, akkor a legfrissebb verziót fogjuk megkapni. Honnan tudjuk, hogy akkor most pontosan melyikre is van szükségünk? Minden egyes commitnál kaptunk vissza egy rövidke hash-t, ami az adott commit-ot jelképezi. A git checkout paraméterként az adott commithoz tartozó hash-t várja el és akkor azt a verziót fogja visszaadni nekünk.

> Na de ki emlékszik már arra, amit előző hét pénteken commit-olt?

Ahhoz, hogy ezt lekérjük, a git log parancsát fogjuk igénybe venni, a következő módon:

```
<pre class="instructions" data-language="shell">git log --pretty=format:"%h %ad | %s%d [%an]" --graph --date=short
```

Így egy szép formátumban kiíratjuk a képernyőre az összes eddigi commitunkat és a hozzá tartozó hash-t (ez lesz a legelső karakterlánc). Emlékszünk, hogy kötelező volt üzenetet hozzátársítani? Így ha több revízióval lépünk vissza, akkor a hozzá kapcsolt üzenetből tudjuk azt beazonosítani és nem a hash-re kell emlékeznünk. Így már mindjárt egyszerűbb lesz, nemde?

<figure aria-describedby="caption-attachment-319" class="wp-caption alignright" id="attachment_319" style="width: 520px">[![gitworkflow](assets/uploads/2015/02/gitworkflow.bmp)](assets/uploads/2015/02/gitworkflow.bmp)<figcaption class="wp-caption-text" id="caption-attachment-319">Két verziót commitoltunk, majd checkout-oltuk a legelsőt, mert beütött a krach.</figcaption></figure>

####  Remote repository

Az eddigi módosítások a helyi, azaz local repository-n zajlottak, még internetkapcsolat se kellett a módosítások végrehajtásához. Azonban ez nem buli és a legtöbb esetben nem is ez lesz a helyzet, hanem egy központi repohoz fogunk mindannyian kapcsolódni.

Tegyük fel, hogy elkezdtünk melózni egy helyen (vagy github-on beszállunk valami projektbe), a legelső amit meg kell tennünk az az, hogy <del>sshfs-en belebarbárkodunk a development szerver kódjába</del> lemásoljuk a repository tartalmát a saját gépünkre. Erre a mi parancsunk a `git clone` lesz. A git több protokollt támogat, amin keresztül kommunikálhatunk, mi most egy szimpla ssh-t fogunk használni.

```
<pre data-language="shell">git clone ssh://username@hostname/path/to/repository /path/to/local/working/dir
```

Ezzel a paranccsal az adott repository-t lemásoljuk a saját gépünkre. Az adott könyvtárban ott lesz a .git (a konkrét repository) könyvtár, valamint a legújabb revízió fájljai checkout-olva (kivéve, ha paraméterekben ezt kikötjük).

> Megjegyzés: Ez nem checkout, nem csak a fájlokat és az adott verziót másoljuk le, hanem a teljes adatbázist leklónozzuk és így a későbbiekben tudunk dolgozni vele lokálisan is.

Helyileg tudunk commitolgatni, azonban ez egyelőre csak a mi repository-nkban érvényes. Ahhoz, hogy ezt felvigyük az adott szerverre, az ún. push-ra lesz szükségünk.

```
<pre data-language="shell">git push ssh://username@hostname/path/to/repository
```

Ezzel a paranccsal feltoljuk az általunk commitolt revíziókat a távoli szerverre és ha nincs ütközés, akkor azt bizony engedni is fogja (kivéve ha force update-et használunk, de erről később).

Ezek csak az alapjai a git használatának és még nem esett szó arról, hogy milyen verziókezelési modellek léteznek, ezekre és a hooks-ok definiálására a következő részben fogok kitérni.