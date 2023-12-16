---
id: 411
title: 'Vagrant és Rio de Janeiro'
date: '2015-03-19T18:35:50+01:00'
author: tacsiazuma
layout: post
guid: '{{ site.url }}/?p=411'
permalink: /2015/03/19/vagrant-es-rio-de-janeiro/
dsq_thread_id:
    - '3609564152'
    - '3609564152'
categories:
    - Advanced
    - Egyéb
tags:
    - dev
    - environment
    - linux
    - samba
    - vagrant
    - 'virtual box'
---

A webfejlesztők életének sok-sok fázisa van. Legtöbbünk úgy kezdi, hogy valahol látja/hallja, megtetszik neki, utána tutorialokat olvas, utánajár, majd felpatkol otthon egy AMP stack-et és azon barbárkodik.

Ekkor hisszük azt, hogy a miénk a világ <span style="text-decoration: line-through;">amíg valaki rommáhackeli az első oldalunkat</span>.

<figure aria-describedby="caption-attachment-417" class="wp-caption aligncenter" id="attachment_417" style="width: 500px">[![60344920](assets/uploads/2015/03/60344920.jpg)](assets/uploads/2015/03/60344920.jpg)<figcaption class="wp-caption-text" id="caption-attachment-417">Reméljük nem itt kötünk ki a végére</figcaption></figure>

Ha szerencséje van az illetőnek, akkor előbb-utóbb oda fejlődik (már ha fejlődik), hogy valaki pénzt is áldoz erre, hogy neki barbárkodjon. Hiszen a juniorokat lehet formálni, még aránylag olcsón. Amikor már nem egyedül barbárkodunk, hanem többen, akkor ugye szóba jön a verziókezelés. Ez pedig több módszer szerint szokott történni.

A fejlesztői környezet többnyire egy dev szerveren van, ahol az ügyeletes <span style="text-decoration: line-through;">Dennis Nedry leellenőríz 2 millió kódsort</span> rendszergazda kiélheti vágyait és egyedüli rootként szövögetheti gonosz terveit a gyanútlan juniorokkal szemben. Na persze ez csak fikció.

Szóval a lényeg, hogy mindenki ezen a dev szerveren dolgozik, mégpedig egy bemountolt Samba nevű megosztott meghajtón. Ezen a gépen fut a development szerver, a vhostok ide mutatnak, ezt nem érjük el kívülről. A projektek gyökereben ott pihennek a háromkarakteres rejtett mappák és mindenki békében commitolgat, míg le nem hal a [codinglove.com](http://thecodinglove.com/), akarom mondani a helyi hálózat.

Ezzel csak az a baj, hogyha az ember egy ütősebb IDE-vel, nagyobb projekt keretein belül akar "beszambázni", annak bizony ára van. A helyi hálózat sebessége nem egy szűk keresztmetszet, ahogy a devszerver memóriája/processzora se lesz az. A gondot itt az jelentheti, hogy a komolyabb IDE-k bizony a háttérben scannelik a projektet, ami egymagában is I/O műveletek százait jelenti a szerver merevlemezén, ha pedig több fejvesztő dolgozik ugyanazon a meghajtón, akkor mégrosszabb a helyzet, ami viszont nem tesz jót semelyik meghajtónak sem és a sok unbuffered folyamat lelassít mindent. Ha pedig ezt lekapcsoljuk, akkor bizony búcsút inthetünk a hőn szeretett code assistancenak.

Ha esetleg code assistance nélkül még eléldegélünk, továbbra is ott lesz a verziókezelés. Egy-egy ütősebb commit az IDE-ken, helyi menün, stb keresztül értékes perceket emészt fel, a checkout pedig szintúgy.

> \- Az a tény, kedves kuzin, hogy a mi kis kópénk Tangonak hívja magát a Samba országában, rögtön megvilágosítja előttünk a tényt, hogy mekkora nagy s\*\*\*fej.  
> \- Terrence Hill

##### Ha Mohamed nem megy a Hegyhez...

Ugye azt hiába akarjuk beadni a főnöknek, hogy mi hobbi szinten átcsaptunk sysadminba és siman fellövünk localhoston egy dev szerver klónt minden pereputtyal, max. kiröhögnek.  
Ha úgy érezzük, hogy a rendszergazdánknak túl sok szabadideje van, mert nyakoncsíptük [MyMan](http://myman.sourceforge.net/) közben, akkor itt a lehetőség, hogy munkát adjunk neki!

<figure aria-describedby="caption-attachment-416" class="wp-caption aligncenter" id="attachment_416" style="width: 640px">[![got-s4e7-mountain](assets/uploads/2015/03/got-s4e7-mountain-1024x525.jpg)](assets/uploads/2015/03/got-s4e7-mountain.jpg)<figcaption class="wp-caption-text" id="caption-attachment-416">- Hello, this is Mountain</figcaption></figure>

##### Buksi, ül!

A program, amiről most szó lesz, egy virtuális gépet fog futtatni a saját gépünkön. A többi virtuális géppel ellentétben ennek nem lesz UI-ja, viszont SSH elérése igen. A lényege annyi, hogy ez a virtuális gép fogja a fejlesztői környezetet, vagyis a dev szervert "szimulálni". Persze itt csak az apache/php és egyéb kiterjesztéseikre gondolok, az SQL-t érdemes meghagyni a régi helyén és a kódunkat kívülről konfigurálhatóvá tenni, de erről a **Zend local/global config** keresőszavak jóféle találatokat hoznak.

> Minek ide másik szerver, akkor ennyi erővel localhoston is fejleszthetnék!

Az extrája az a dolognak, hogy amikor elindítjuk ezt a gépezetet, akkor beállíthatjuk, hogy egyes fájlokat, pl. konfig fájlokat lerántson a dev szerverről, bemountolja a localhostos htdocs könyvtárunkat, stb. Ezáltal nekünk csak el kell indítanunk és a többit rátukmálni a rendszergazdára. Ezek a boxok hordozhatók, így elég egyszer jól felkonfigurálni és átadható a többi fejlesztő kollégának is. Na de először nézzük meg, hogy is lehet ezt fellőni, konfigurálni, meg úgy egyáltalán.. [töltsük le](http://www.vagrantup.com/downloads)!  
Ha ezzel megvolnánk és a gépünkön fent van a VMWare, vagy VirtualBox, akkor már próbálgathatjuk is a dolgot. A parancssorból tudjuk irányítani mindezt, ezt pedig windows alól se ússzuk meg, úgyhogy mindenki kéretik a terminálhoz.  
Itt navigáljunk el egy ennek dedikált könyvtárhoz és írjuk be a következőt:

```
<pre data-language="shell" style="text-align: justify;">vagrant init
```

Ez létrehoz az adott könyvtárban egy Vagrantfile nevű konfigurációs fájlt, amit majd később mi is fogunk molesztálni.  
Viszont ez még csak egy konfig fájl, hogy lesz ebből virtuális gép? Úgy, hogy letöltünk egyet az előre készítettek közül a [vagrantbox.es](http://vagrantbox.es) webhelyen találhatóak közül. Most ezt kikerüljük és ha sikerült meggyőznünk az illetékeseket arról, hogy ez a tuti, akkor majd ők hozzáigazítják a devszerverhez.

Adjunk hozzá tehát egy általánosan használható boxot. Töröljük a fent említett konfig fájlt és írjuk be a következőt:

```
<pre data-language="shell" style="text-align: justify;">vagrant init hashicorp/precise
```

A vagrant init parancsa első paraméterében egy box nevet vár, amit ő le is tölt majd. Ha ezek után beírjuk azt, hogy <del>buksi ül</del>`vagrant up`

Ha ezt megtettük és nem is szakítottuk meg az adott process-t, akkor a szerverünkön a háttérben már fut is egy működőképes Ubuntu. Ha szeretnénk molesztálni, akkor `vagrant ssh` parancssal megtehetjük. Ha pedig meguntuk, hogy dolby stereoban mennek az oprendszerek, akkor egy `vagrant destroy`-al eltakaríthatjuk azt.  
Ha fejleszteni kezdesz, akkor fejlesztőként egy jól konfigurált vagrant mellett ennyi és nem több dolgod lesz, a többit bízd [Dennis Nedry](#dennisnedry)-re!  
Na de mielőtt outsourceolnánk a munkát, nem árt ha megismerjük azért a működését.  
Provision  
A vagrant up parancsra lefutnak a konfig fájlban foglalt parancsok, amikkel testreszabhatjuk, inicializálhatjuk az adott boxot. Itt sok apróság beállítható, pl a bemountolni kívánt könyvtárak, stb.  
Ezáltal megoldható, hogy pl egy megosztott könyvtárból berántsuk az apache config fájljait, induláskor frissítve a vhost configurációt, esetleg egyéb service-ek fellövésére is van lehetőség.  
Aki ráizgult a témára, az kérem füstjelezzen valamit és mélyebben kitárgyaljuk a dolgot!