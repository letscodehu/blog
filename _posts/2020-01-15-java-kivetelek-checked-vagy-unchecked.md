---
id: 1941
title: 'Java kivételek &#8211; Checked vagy unchecked?'
date: '2020-01-15T12:43:05+01:00'
author: tacsiazuma
layout: post
guid: '/?p=1941'
permalink: /2020/01/15/java-kivetelek-checked-vagy-unchecked/
newsphere-meta-content-alignment:
    - align-content-left
image: 'assets/uploads/2020/01/15120546/1_LA8An0WpL8hLbdaaaH8vDw.png'
categories:
    - Backend
    - Java
tags:
    - checked
    - exception
    - java
    - unchecked
---

<figure class="wp-block-image">![](https://cdn-images-1.medium.com/max/2600/1*LA8An0WpL8hLbdaaaH8vDw.png)</figure>Java nyelvben kétféle kivételt különböztetünk meg:

- **Checked** — ezek azok, amiket a compiler maga is ellenőríz. Amikor eldobod, akkor vagy helyben kezelned kell, vagy meg kell jelölnöd a metódus `throws` deklarációjában, különben a kódod le se fog fordulni. Ezek azok, amik az `Exception` osztályból örökíthetőek le.
- **Unchecked** —ezek értelemszerűen fordítási időben nem kerülnek ellenőrzésre. `try/catch` blokk nélkül használhatóak és még a fenti throws-al se kell jelezni őket. Ha ilyet akarsz létrehozni, akkor a `RuntimeException` osztályból kiindulva van rá lehetőséged. A java runtimeban szintén találhatóak még ilyenek, amik az Error osztályból származnak. Őket lehetne a harmadik típusnak venni, de mi magunk nem dobunk ilyeneket.

A legtöbb más nyelvben nincs a checked exceptionhöz hasonló koncepció, leginkább azért, mert sokszor csak terhet jelent, de nézzük meg, melyik típust mikor is kellene használnunk!

#### Unchecked kivételek

Ezek azok a kivételek, amikre fel tudsz készülni. Ha mégis dobódnak, az azt jelenti, hogy valamire nem készültél fel. Na de miért mondom ezt?

Nézzünk meg egy párat közülük:

- **NullPointerException**: Ez a kedvencem, akkor történik, amikor egy metódust akarsz hívni, vagy mezőt akarsz elérni egy olyan referencián, ami szimplán üres. De leellenőrízhettük volna előtte, nem? Tehát amikor `NullPointerException` dobódik, akkor az azért történt, mert lusták voltunk ellenőrízni és biztosra menni, hogy ez nem történik meg.
- **ArithmeticException**: Szintén kedvenc. Akkor történik, amikor valami szörnységet akarunk elkövetni, már számtani értelemben, például mikor nullával osztunk. Nem tudom eleget ismételni magam. Mi az istenért nem ellenőríztük, hogy az osztónk nulla?
- **IndexOutOfBoundsException**: Ez akkor történik, amikor egy olyan indexet akarusz elérni, ami az adott konténer (karakterlánc vagy tömb) határain kívül van . Szégyelld magad!
- **UnsupportedOperationException**: Ez egy speciális eset, abban az értelemben, hogy itt nem személyesen mi szúrtunk el valamit. Ez azért történhet, mert a Java runtime készítői megpróbáltak visszafelé kompatibilis módosításokat végbevinni, cserébe tönkrevágták a Collections API-t olyan dolgokkal, amik nem valók oda. Persze ha te magad dobsz ilyet kézzel, akkor az ISP elvet megszeged és.. úgyis tudod.

Akkor mi a megoldás az ilyen kivételek ellen? Elővigyázatosság.

Az `Error`okra visszatérve: ne is próbáld elkapni őket. Egyszerűen ne. Ezek olyan problémákat jeleznek, amiket a JVM-en belül úgysem tudnál megoldani.

#### Checked kivételek

Na és ezekkel mi a helyzet? Ezekre bizony ne mtudunk felkészülni. Külső okokra vezethetőek általában vissza.

- **IOException**: Jajj. Azt hinnénk, hogy a hálózat mindig ott van, a merevlemez alanyi jogon jár és senki sem törölt olyan fájlokat, amiket mi éppen olvasni akarunk, de néha.. hát igen, beüt a krach.
- **SQLException:** Majdnem elfelejtettük az ősellenségünket! Ezzel akkor találkozhatunk, amikor elszúrtuk a lekérdezést, a táblánk más típust tartalmaz, mint amit mi ki szeretnénk nyerni és még sorolhatnánk. Nincs rá mód, hogy békésen elérjünk egy relációs adatbázist. `Exception` vagy `ResultSet`. Te választasz.
- **ScriptException**: Jézusom, miért van egyáltalán ilyen Javaban? Ez akkor fordulhat elő, amikor mögöttes script értelmező nem tud értelmezni vagy éppen futtatni valamilyen scriptet. De hogyan is tudnánk letesztelni, hogy egy JavaScript kódrészlet tartalmaz-e szintaktikai vagy éppen futásidejű hibákat, anélkül hogy lefuttatnánk azt? Igen, Regexpel! Nem.

Tehát oda jutottunk, hogy a fenti problémák megelőzésére nemigen van semmilyen módszerünk. Ennélfogva muszáj követnünk azt az elvet, hogy checked exceptionöket használunk abban az esetben, amikor nem tudunk bolondbiztos megoldást találni. Minden egyéb esetben unchecked kivételekre kell hagyatkoznunk.

Egy gyakori probléma a checked kivételek esetében, hogy széleskörben használjuk őket mindenféle indok nélkül, hogy aztán az a <s>szerencsétlen</s> valaki, aki használná a keretrendszerünket/libünket, a végén mindenhol kénytelen elnyelni a kivételeket, üres catch blokkokat szórva szét a kódjában, mert nem tud mit kezdeni a kivételekkel, amik amúgy végigjárnák az egész control flow-t. Szintén probléma, hogy mivel ezek megjelennek a forráskódban, fordításidejű dependenciát jelentenek, ami szembe megy a dependency inversion elvvel.

Tehát legközelebb, amikor létrehozol egy új kivétel osztályt Javaban, állj meg egy percre és tedd fel magadnak a kérdést:

- Tud ennek a metódusnak a használója bármit tenni annak érdekében, hogy elkerülje a hibát? Igen? Marad **unchecked**.
- A probléma azért történik, mert külső tényezők is közrejátszanak, pl. I/O vagy egyéb paraméterek, amiket nem látunk előre? Legyen **checked**.