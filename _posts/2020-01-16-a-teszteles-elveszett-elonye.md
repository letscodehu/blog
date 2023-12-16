---
id: 1678
title: 'A tesztelés elveszett előnye'
date: '2020-01-16T10:27:00+01:00'
author: tacsiazuma
layout: post
guid: '{{ site.url }}/admin/?p=1678'
permalink: /2020/01/16/a-teszteles-elveszett-elonye/
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
image: 'assets/uploads/2019/01/09202521/0_z33ERf1bMQjMcSrn.png'
categories:
    - Backend
    - Java
    - Testing
tags:
    - mock
    - refactor
    - testing
    - unit
---

Unit tesztelni jó. Rengeteg előnnyel jár, de valahogy nagyon sokan vannak akik még mindig utálják. Ezért nem a tesztelést kell hibáztatni, hanem azt, ahogy végezzük.

(A cikkben több helyen a mock/mockolás szavakat használom, habár a test double/teszt dublőr lenne a megfelelő, de sok esetben ez kényelmesebb volt)

Na de nézzük hát azokat az előnyöket:

- Jobb design — magától értetődő, hogy ahhoz, hogy unit tesztet írjunk egy adott egységhez, akkor azt úgy kell megírni, hogy könnyen elválasztható legyen a kód többi részétől.
- Dokumentáció — a tesztek neve önmagában dokumentálja, hogy is működik az adott unit. Még egy rosszul elnevezett tesztmetódus esetén is rá tudsz jönni mit csinál, ha belenézel a belsejébe.
- Hibakeresés — még ha nem is erre szolgálnak, tesztek segítségével regressziós hibákat tudunk megfogni.
- Költségek hosszú távú csökkentése — Azokon a projekteken, amik tovább tartanak pár hétnél és komplexebbek egy landing oldalnál, a tesztek segíthetnek hogy elkerüljük azt a káoszt, ami később extra munkaórát okozna, ezzel pénzt spórolva meg nekünk.
- Biztonságos refaktorálás — ez a cikk erre fog fókuszálni.

### **Mi az a refaktorálás?**

> *A refaktorálás az a folyamat, amiben átalakítjuk a kód szerkezetét anélkül, hogy megválzotatnánk annak külső működését.*

Na de mit értünk azon, hogy “anélkül, hogy megváltoztatnánk a külső működését”? Ez azt jelenti, hogy kiválasztunk egy kódrészletet és úgy változtatjuk meg, hogy a pre- és posztkondíciók nem változnak. A kód ugyanazt fogja tenni, mint eddig. Ha ez a bizonyos kódrészlet egy metódus, ez azt jelenti, hogy az interfész nem változik, csak a belseje.

Hogy biztosítjuk azt, hogy semmi sem változott? Na itt jönnek azok a bizonyos tesztek a képbe.

Ha voltak tesztjeink arra a kódrészletre, akkor csak futtatjuk őket és bármilyen hiba azt jelzi, hogy megváltoztattuk azok működését.

### **Refaktorálás vs. új funkciók**

A refaktorálás az a folyamat amikor úgy struktúráljuk át a kódot, hogy **szándékosan NEM módosítjuk a működést**.

Új funkció hozzáadása pedig mikor **szándékosan módosítjuk a működést.**

Az emberek többsége összekeveri a refaktorálást azzal, hogy új funkciókat ad a rendszerhez. Ez a folyamat gyakran nem áll meg egy osztály szintjén, hanem egy nagy adag kódot átírunk, ami még tovább ront a helyzeten. A végén mikor futtatjuk a teszteket egy rakás hibára fut. Na de mi ennek az oka? A refaktorálás? Vagy az a logika amit hozzáadtunk az új funkcióhoz valahogy nem illik a rendszerbe? Ki tudja? Ezért az emberek végül visszavonják a módosításaikat, vagy - rosszabb esetben - átírják a teszteket, hogy megfeleljenek az új körülményekhez, még akkor is, ha nem értik azt.

<figure class="graf graf--figure">![](https://cdn-images-1.medium.com/max/800/0*C5BMk5BzUWpnfEBK)<figcaption class="imageCaption">Új featuret adunk hozzá. Nem foglalkozunk azzal, hogy is néz ki, elég ha elvégzi a feladatot, ezt pedig a tesztjeink bizonyítják.</figcaption></figure>Egyiket sem tanácsolnám. Egyszerűen dobd össze a kódot egészen, míg a feature nem működik - persze tesztekkel fedve - és ezután kezd el feltakarítani amit csináltál.

<figure class="graf graf--figure">![](https://cdn-images-1.medium.com/max/800/0*z33ERf1bMQjMcSrn)A refaktorálás. Nem adunk semmi újat a rendszerhez, csak megpróbáljuk kicsinosítani.</figure>Az egyik előadásomon a hallgatóságból valaki megkérdezte, hogy rosszul csinál-e valamit, mert

> Egy csomó teszt eltört, mikor refaktoráltam a kódot, így azokat is utána kellett húzzam…

<figure class="graf graf--figure">![](https://cdn-images-1.medium.com/max/800/0*3mHLCOLAn60gCJ1R)Ha refaktorálsz akkor nem szabad a tesztekhez nyúlnod, ugyanis akkor már nem lehet refaktorálásnak nevezni a folyamatot.</figure>Ez most kicsit más, mint amiről az imént szó volt, ugyanis ebben az esetben elvben csak refaktorálásról van szó és nem keverjük új funkciókkal.

Akkor mi lehet mégis a gond? A tény, hogy "egy csomó teszt"-et említ elgondolkodtat, hogy mégis hogy is vannak struktúrálva ezek a tesztek? Persze azért is lehet, mert újraírta a fél rendszert - tehát a refaktorálás volt túl nagy - vagy csak szimplán olyan csúnyaságokat csinált, mint túl generikus teszteket írt, de erről majd lesz szó később.

A lényeg, hogy felismerte a problémát, ami sajnos sok fejlesztő esetében elmarad.

Akkor mi lehet mégis ennek az egésznek az oka?

- Félreértések a refaktorálásról
- A tesztelendő egység fogalma
- Törékeny tesztek

Nézzük meg ezeket akkor külön-külön!

### **Félreértések a refaktorálásról**

<figure class="graf graf--figure">![](https://cdn-images-1.medium.com/max/800/0*a6S35MzmvzCt5dco)Ha ránézel erre a képre anélkül, hogy teljesen értenéd mi is az a TDD, teljesen természetesnek gondolod, hogy a refaktorálás után törő tesztek jönnek.</figure>Habár ez a cikk egyáltalán nem a TDD-ről szól, vizsgáljuk meg a fenti diagramot. Miért is gondolná bárki, hogy a teszteket utánahúzni, miután eltörtek a refaktorálás miatt rossz, ha ilyen "bizonyíték" kering az interneten? Lényegében azt mondja, hogy a refaktorálás után el fognak törni a tesztek. Megjavítjuk őket és ismét zöldek lesznek. A probléma ott van, hogy a fenti kép nélkülözi a folyamatot az egyes lépések közt, nem úgy mint ez itt lentebb:

<figure class="graf graf--figure">![](https://cdn-images-1.medium.com/max/800/0*W76yFiorIisdpbV1)</figure>Nos ez valóban elmondja az igazat, miszerint refaktorálás után nem törő tesztek közt találjuk magunkat. Éppen ellenkezőleg, sikeresnek kell lenniük, hogy tovább haladjunk.

### **A tesztelendő egység fogalma**

Mi az a unit?

> Intuitively, one can view a unit as the smallest testable part of an application. — Wikipedia

Intuitively, azaz ösztönszerűen. Pont ez a szó, ahol minden félrement. Ha bárki beszél vagy ír a unit tesztelésről, akkor biztosan metódust, osztályt, vagy éppen függvényt ért alatta.

Minden egyebet izolálunk, megvizsgáljuk a belsejét a kis kódrészletnek. Persze ha használunk statikus kódanalizálókat, Sonart és hasonlókat, akkor igen könnyen apró metódusoknál kötünk ki, kis komplexitással, rövid osztályok, amik csak egy apró dolgot csinálnak. De ez a csöppnyi osztály a pár kódsorral mégis mit jelent az üzlet számára? Egy if-else ág reprezentál egy funkcionalitást? Nézzük meg, hogy a legtöbb fejlesztő hogy ír teszteket!

### A tipikus tesztjeink

<figure class="graf graf--figure">![](https://cdn-images-1.medium.com/max/800/1*gEUTPgC55HSOSRKQWyTR6g.png)<figcaption class="imageCaption">Ahogy általában a tesztjeinket struktúráluk</figcaption></figure>OOP környezetben általában létrehozunk egy teszt osztályt minden egyes tesztelendő osztályhoz. Végigteszteljük az összes publikus metódust ezen az osztályon, miközben kicserélünk minden kollaborátort az épp kéznél levő mock keretrendszer segítségével, hogy jobban tudjunk arra a logikára fókuszálni, ami belül van.

Tegyük fel, hogy van három ilyen osztályunk:

- UserService
- EmailValidator
- UserRepository

Akkor nyugodtan mondhatjuk, hogy van három ilyen tesztünk is:

- UserServiceTest
- EmailValidatorTest
- UserRepositoryTest

Problémát jelent mindez? Nem, egészen addig amíg nem módosítunk valamin. Réges-rég megtanultuk, hogy mennyire fontos a loose coupling, de a tesztjeinkben valahogy mégis elfelejtettük azt.

A fenti megközelítéssel hozzáragasztjuk a tesztjeink struktúráját az éles osztályokhoz, ami még jobban megnehezíti a refaktorálást. Habár mindkét csoport ugyanazt a működést hivatott leírni vagy épp megvalósítani, a struktúrájuk eltérhet.

Úgy gondolom - és ezzel lehet sokan nem értenek egyet - hogy az osztály nem a legkisebb tesztelhető egység. Az esetek többségében már a legegyszerűbb feladatokra is több osztályt hozunk létre. Véleményem szerint az ilyen osztály csoportokat izolálva kapjuk meg azt, amit unitnak tudunk hívni.

<figure class="graf graf--figure">![](https://cdn-images-1.medium.com/max/800/0*avMaNxJQhFmn6IGg)</figure>Nézzünk egy példát! Java nyelvet fogunk használni, mert az egyik legelterjedtebb nyelv. Elég buta példa lesz ahhoz, hogy érthető legyen, de komplex annyira, hogy a problémát be lehessen rajta mutatni.

<figure class="graf graf--figure">![](https://cdn-images-1.medium.com/max/800/0*fs-Cu6m5qmVTRQ2g)</figure>Van egy egyszerű szolgáltatásunk, ami felhasználókat tud létrehozni. Jön egy kérés valahonnan, ami minden információt tárol ahhoz, hogy létre tudjuk hozni. Végrehajtunk némi alapvető validációt - null ellenőrzést, hogy pontosak legyünk - egy kis transzformációt és már adjuk is tovább lefelé, hogy elmentsük az alsóbb rétegekben.

Nézzük meg hogy is struktúrálnánk a tesztünket. A korábbi egy osztály - egy teszt elvet fogjuk követni az elején.

<figure class="graf graf--figure">![](https://cdn-images-1.medium.com/max/800/0*aXOs8SeuSCoG41Gm)<figcaption class="imageCaption"></figcaption></figure>Létrehozunk egy mockot a repository számára és átadjuk a szolgálatásunk konstruktorának.

Ezután létrehozzuk az első teszteket hozzá. Egy a validációra, egy a transzformációra és egy pedig arra, hogy ellenőrízzük, valóban elmentettük az átalakított objektumot.

<figure class="graf graf--figure">![](https://cdn-images-1.medium.com/max/800/0*GL8N4uvkkSAIek4i)</figure>Apró részeket ellenőrzünk a kódban. Nem akarjuk az egész metódust újra és újra ellenőrízni, mivel abban az esetben a lefedettség erősen átfedne. Ha ez bekövetkezik, akkor a tesztjeink nem elég specifikusak ahhoz, hogy megmutassák pontosan hol van a hiba.

Tehát megvannak a tesztjeink, amiket ha lefuttatunk, akkor mind zöld. Ez a mi kezdő pontunk.

Kezdjük el refaktorálni a kódot. Először csak kiemeljük a logikát privát metódusokba:

<figure class="graf graf--figure">![](https://cdn-images-1.medium.com/max/800/0*op64Jx1nTW-a8OhJ)</figure>Türelem, habár őrültségnek tűnhetnek ezek az egysoros kis függvények, de ez a technika nagyobb kódbázisokra is érvényes lesz.

> Megjegyzés: Egyértelmű, hogy privát metódusokat külön nem, hanem a publikus metódusokon keresztül teszteljük.

Módosítottuk az éles kódot. Újrafuttatjuk a teszteket, amik még mindig zöldek, de hát ez nem újdonság.

Menjünk tovább a refaktorálással. Mi lenne, ha a validátot kimozgatnánk egy új osztályba?

Létrehozunk egy új osztályt, egy metódussal, ami a szolgáltatásból átvett kódot tartalmazza:

<figure class="graf graf--figure">![](https://cdn-images-1.medium.com/max/800/0*Xd1akAvsG8asiP2U)</figure>Ezután hozzáadjuk a UserService osztályhoz, mint egy új kollaborátor és a korábbi privát metódust lecseréljük.

<figure class="graf graf--figure">![](https://cdn-images-1.medium.com/max/800/0*WRSChxVHh-KPNIqN)</figure>Kész vagyunk a refaktorálással és még ha nem is követjük a TDD-t, a következő lépésünk az lesz, hogy újrafuttatjuk a teszteket és azt várjuk, hogy zöldek legyenek.

De nem lesznek.

<figure class="graf graf--figure">![](https://cdn-images-1.medium.com/max/800/0*E9qqXguI4f62t2U9)</figure>Fordítási hibával végződik, hiszen egy új konstruktor paramétert adtunk hozzá, amit a teszt kódban még nem határoztunk meg. De kit érdekel? Hozzuk létre a hozzá tartozó mockot és adjuk át paraméterül:

<figure class="graf graf--figure">![](https://cdn-images-1.medium.com/max/800/0*djoPDjRo_TSC_Ci8)</figure>Igen ám, de ha létrehozunk egy mockot, az önmagában még nem oldja meg a problémát, hiszen azt fel is kell konfigurálni, mert ellenkező esetben nem fog kivételt dobni, mint ahogy várnánk. Ez habár apró módosításnak tűnik, ne tévesszen meg, csupán azért van, mert a példánk is kicsi. Viszont még így is bele kellett nyúlnunk a tesztekbe, habár a create metódus működése fikarcnyit sem változott. Na és ez az a pillanat, amikor

**elvesztettük azt a biztonságot, amit a tesztek nyújtottak.**

De még semmi sincs veszve, vonjuk vissza a módosításainkat és menjünk vissza oda, mikor privát metódusokba emeltük ki a logikát. A tesztek zöldek, tehát elkezdhetünk refaktorálni. Első lépésként létrehozunk egy factory-t a szolgáltatásunk számára:

<figure class="graf graf--figure">![](https://cdn-images-1.medium.com/max/800/0*0hgIFA4IpsL9DjGj)</figure>Ebben létrehozunk egy metódust, aminek a **createDefault** nevet adjuk. A nevezéktan közel sem új, számos függvénykönyvtár biztosít default implementációkat buildereken és factorykon keresztül. Ezek segítségével anélkül tudjuk használni a könyvtárat, hogy tudnánk mégis miképp épülnek fel az osztályok. A metódusunk statikus is lehet, mivel nem fogjuk kimockolni, nincsenek benne olyan elemek, amik miatt nehéz lenne tesztelni pl. I/O vagy szálkezelés, valamint az IoC konténerben is tudjuk majd használni.

Cseréljük hát le a konstruktort a setup metódusból:

<figure class="graf graf--figure">![](https://cdn-images-1.medium.com/max/800/0*JZ99ukqTKynJDHS_)</figure>Ezzel bevezettünk egy újabb réteget a tesztünk és a konstruktor között, eliminálva az interfészek közti kötődést. Még nem látunk semmiféle eredményt, de futtassuk le a teszteket. Zöldek.

Ezután nincs más hátra, mint megismételni a legutóbbi lépésünket. Emeljük ki a validációs logikát egy új osztályba - ami legutóbb fordítási hibát okozott - és adjuk hozzá a példányosítást a factoryhoz, ami még mindig éles kód, ugye? Tehát nyugodtan megtehetjük:

<figure class="graf graf--figure">![](https://cdn-images-1.medium.com/max/800/0*EisW8BUISouQsYOB)<figcaption class="imageCaption">Hozzáadunk egy új paramétert a konstruktorhoz, de a factory metódus interfésze érintetlen marad.</figcaption></figure>Mivel default implementációról beszélünk, ezért csak átadunk egy validátort. Értelemszerűen az IoC konténerünk számára létrehozunk egy overloadolt factory metódust.

Ha szigorúan mockista vagy, akkor most körülbelül így festhetsz:

<figure class="graf graf--figure">![](https://cdn-images-1.medium.com/max/800/0*GHZADMO6INvBCaB3)</figure>Mit tettem? Miért használom az eredeti implementációt ahelyett, hogy valami teszt dublőrre cserélném? Azért, mert ez is része a tesztnek. A logikát kimozgattuk az eredeti osztályból, de továbbra is használjuk. Ahelyett, hogy létrehoznánk egy új UserCreateRequestValidatorTest osztályt, a már meglévő tesztünkben tesszük meg. Tehát ha megnézzük a tesztlefedettséget, akkor láthatjuk, hogy minden ágat lefedtünk itt is:

<figure class="graf graf--figure">![](https://cdn-images-1.medium.com/max/800/0*0zOtFz97HEloBKWj)<figcaption class="imageCaption"></figcaption></figure><figure class="graf graf--figure">![](https://cdn-images-1.medium.com/max/800/0*cdnBcnFpG8oZXOzQ)<figcaption class="imageCaption"></figcaption></figure>Tehát akkor mégis mit tettünk? Egy picit másfajta megközelítéssel indultunk neki és hagytuk, hogy a tesztjeink nagyobb területet fedjenek le. Megengedtük, hogy kicsússzon a UserService határain túl és a kollaborátorokat is érje. Mivel nagyobb hatáskört tesztelünk, ezért a tesztjeinket is strukúrálhatjuk másképp. Tehát egy teszt fókuszál majd az adott osztály egy metódusára. A többi metódushoz újabbakat hozunk létre, de azok továbbra is használják majd a kollaborátorokat.

<figure class="graf graf--figure">![](https://cdn-images-1.medium.com/max/800/1*zFBCmJLfYU_T4KciU9L2yA.png)</figure>Na és milyen kollaborátorokat használhatunk itt? Azokat, amik kimenete determinisztikus. Pure functionöket, amik mindig ugyanazt a kimenetet produkálják az adott bemenetre. Amikor egy null paramétert adunk át a validátorunknak, akkor az kivételt fog dobni, ha törik, ha szakad. Ezek olyanok, mint a Math könyvtár függvényei. Ha meghívod a Math.floor(5.1)-t, nincs esélye, hogy 5-ön kívül mással térjen vissza.

De továbbra is szükségünk van tesztdublőrökre az olyan esetekben, amikor a kimenet nem determinisztikus, mint a repository esetén.

Folytassuk a refaktorálást!

Kimozgatjuk a transformert:

<figure class="graf graf--figure">![](https://cdn-images-1.medium.com/max/800/0*mZzRz6m53-urB0Qq)</figure>A UserServicet átírjuk, hogy használja is:

<figure class="graf graf--figure">![](https://cdn-images-1.medium.com/max/800/0*x3RUp1npHpWh9Mhv)</figure>Valamint hozzáadjuk a factory-hoz:

<figure class="graf graf--figure">![](https://cdn-images-1.medium.com/max/800/0*r7gzcXjHuNSIaZfF)</figure>Újrafuttatjuk a teszteket: még mindig zöld.

Mi a helyzet azokkal az osztályokkal, amiket a unitokon átívelően használunk? Újra és újra teszteljük őket? Ugyanazokkal az esetekkel? Bizony. Ám ezek az esetek különböző kontextusban történnek. Ennélfogva, mikor refaktorálunk egy ilyen kollaborátort, ami két tesztelt unitban is használva van, a végén pedig az egyikhez tartozó tesztek eltörnek, akkor tudjuk, hogy olyan módosítást vittünk végbe, ami nem igazodik ahhoz a kontextushoz.

### Megjegyzés a mockolásról

Mi történne másképp, ha mockokat használunk valós implementációk helyett? Menjünk vissza ahhoz a ponthoz, amikor mock validatort használtunk:

<figure class="graf graf--figure">![](https://cdn-images-1.medium.com/max/800/0*IJm-OchvhxD-TC_z)</figure>Ebben az esetben felkonfiguráljuk, hogy dobjon kivételt, amikor null paramétert kap. Még azt is meg kell mondjuk neki milyen típusú kivételt dobjon.

De mi a helyzet akkor, ha időközben valaki odaszambázott és módosította a validátor kódját? Megbízunk benne, hogy a tesztet is módosította az új működésnek megfelelően? Mi van akkor, ha mostantól csak logol egy üzenetet minden egyes alkalommal, ahelyett, hogy kivételt dobna? Lehet, hogy utánahúzták a kódot a hozzá tartozó XYValidatorTestben, de itt egy olyan esetet fogunk tesztelni, ami sosem történik meg. Természetesen egy magasabb szintű teszt ezt a hibát elkapná, de ha ránézünk a tesztpiramisra, akkor tudjuk, hogy kevesebb magasszintű tesztet hozunk létre és talán ez a hiba éles környezetben köt ki. A nagyobb probléma az inkább, hogy nehéz lesz megtalálni, mert tönkretettük a legjobb dokumentációnkat, a tesztünket. Mostantól az is hazudik, ugyanúgy ahogy a dokumentáció szokott.

Összegezve:

- redukálhatjuk a mockok létrehozásával töltött időt
- a konstruktorunkat elválasztjuk a teszttől
- az eredeti implementációkat használjuk, ahol lehet

Mindezek segíthetnek, hogy egy olyan környezetet teremts, ahol a biztonságos refaktorálás már nem álom csupán.