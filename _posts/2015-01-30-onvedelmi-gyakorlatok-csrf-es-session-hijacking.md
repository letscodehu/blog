---
id: 203
title: 'Önvédelmi gyakorlatok &#8211; CSRF és Session hijacking'
date: '2015-01-30T20:16:20+01:00'
author: tacsiazuma
layout: post
guid: '{{ site.url }}/?p=203'
permalink: /2015/01/30/onvedelmi-gyakorlatok-csrf-es-session-hijacking/
dsq_thread_id:
    - '3470493903'
    - '3470493903'
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
    - Backend
    - Intermediate
    - Security
tags:
    - cross
    - csrf
    - forgery
    - get
    - hijacking
    - post
    - request
    - session
    - site
    - token
---

Az [előző]({{ site.url }}/2015/01/22/onvedelmi-gyakorlatok-1-resz/) részben végigvettünk pár támadási formát és az ellenük való védekezés lehetőségét. Ebben a részben a CSRF-el, a cross site request forgery-vel és a session hijackingel fogunk foglalkozni.

A CSRF támadások azt használja ki, hogy az adott oldal megbízik a felhasználóban és nem ellenőrzi, hogy adott lekérést valóban a felhasználó vitte-e véghez, mégpedig valóban a saját oldaláról.[![form_builder](assets/uploads/2015/01/form_builder.jpg)](assets/uploads/2015/01/form_builder.jpg)

A CSRF támadások általában fórumokról indulnak, ahol az egyes hozzászólások szövegét az XSS-nél említett htmlentities-el már hatástalanították, így javascript kódot nem tudnak posztolni, ellenben képet igen. A képek src attributumában el lehet helyezni ártalmas kódot, a következőképpen:

```
<pre data-language="html"><img src="http://letscode.hu/wp-admin/post.php?post=243&action=delete" />
```

Ugye mikor a böngészőnk ezt meglátja, akkor azt feltételezi, hogy az src-ben szereplő lekérés egy képet fog majd visszaadni, így küld egy lekérést oda is.

> De hát ezt meg tudná csinálni a saját böngészőjével is, mi ebben a pláne?

A pláne az, hogy a lekérést a felhasználónk böngészője teszi, amiben ott lapulnak az esetleges oldalra tartozó session cookie-k, amik által a szerver őt fogja a lekérés indítójaként azonosítani, ha az oldal megbízik a kérésben és elhiszi, hogy azt valóban a felhasználó végezte. (A böngészőnk pedig rinyál egy sort, hiszen a lekérés által visszaadott tartalom text/html. Viszont a támadónk se fogja látni, hogy az adott lekérésre milyen válasz jött, max ha JS kódot is tud futttatni az adott felületen, de akkor már XSS-ről is beszélünk)

Persze ez az eset közel sem nevezhető súlyosnak, hiszen nem pénzügyi adatokról és hasonlókról van szó, de ugyanezt az elvet követve durva dolgok is történhettek volna.

Tehát a lényeg:

> A user meglátogatja B oldalt, ahol egy C oldalra mutató link van img tagben, ami C oldalon A user be van épp jelentkezve.

#### Mit is tegyünk ez ellen?

Régi megoldások egyike, hogy a session ID-t GET paraméterben is elfogadta az adott oldal. Ezt NE tegyük. Session ID-t mindenesetben cookie-ban tároljunk, viszont még ez se véd meg minket mindentől, ugyanis a PHP alap session ID-je viszonylag limitált értéket vehet fel és azt a timestamp alapján generálja, így egy bizonyos tartományon belüli értéket fog felvenni, amit a támadó kikövetkeztethet.

> 1\. szabály, a GET paraméterek, ahogy nevük is mutatja, csupán adatok lekérdezésére szolgál(ja)nak, bárminemű módosításhoz POST kérés szükséges.

Ha a GET paramétereket a helyén kezeljük (és csak a routerünk használja azt, lehetőleg whitelistingel), akkor maradnak a POST lekérések, valamint ellenőrízzük a HTTP\_REFERER-t, hiszen így kiszűrhetjük, ha más oldalról érkezik a lekérés.

> Megjegyzés: ahol nincs űrlap és annak adatainak feldolgozása, ott nem lehet CSRF támadást véghezvinni

Ha POST kérést küldtünk a szerverünknek, még mindig lehetünk pácban. Ennek kivédésére jött létre az ún. CSRF token. Ennek az a lényege, hogy egy a támadó által ismeretlen mező/érték párost is beleteszünk az űrlapunkba és amikor az űrlapadatokat kiértékeljük, ez alapján is szűrjük a dolgot.

Ezt a következőképp tehetjük: generálunk egy ún CSRF token-t. Ezt a legegyszerűbben egy md5(uniqid(rand()))-al (de md5-öt ne használjunk, erre majd kitérek miért) tudjuk megtenni, ami generál nekünk egy egyedi azonosítót, amit hidden input field-ként az űrlapunkba teszünk (minden egyes űrlapnál újragenerálva), valamint a $\_SESSION-be is. Amikor kiértékeljük a formot, ellenőrízzük, hogy létezik-e egyáltalán az sessionben az adott kulcs, ha nem, akkor a lekérést figyelmen kívül hagyjuk. Ha nem egyezik a formban kapott CSRF token értéke és a sessionben tárolt érték, szintén invalid a lekérés. Ha minden klappol, akkor elkezdhetünk foglalkozni a form tényleges tartalommal bíró elemeivel.

A bejelentkező űrlapoknál lehet látni az ún. bejelentkezve maradok jelölőnégyzetet, ami csupán a session cookie élettartamát hivatott változtatni. Ezzel az a baj, hogy minél tovább bejelentkezve tartjuk a felhasználónkat, annál több idő van kitalálni azt a bizonyos CSRF tokent, netán magát a session ID-t.

És itt el is érkeztünk a cikkünk második feléhez, a session hijackinghez.

#### Session hijacking

Mi alapján azonosítjuk a felhasználónkat? Honnan tudjuk, hogy ő az? Hát $\_SESSION-ben ott van egy hozzá tartozó mező, nem? Na de a szerverünk honnan azonosítja azt a bizonyos session-t, hiszen mint tudjuk a HTTP egy stateless protokoll, vagyis a két lekérés közt nincs kapcsolat, egymástól függetlenek. Sütik, mint mindig. Egy ún. PHPSESSID (legalábbis alapértelmezett esetben) cookie-t küld el a szerverünk minden egyes kéréssel és a szerverünk ezáltal tudja hozzárendelni az adott session-t a lekéréshez. A HTTP 1.1 így tudja elérni, hogy úgy tűnik, mintha mégsem lenne stateless az a protokoll 🙂[![e2b](assets/uploads/2015/01/e2b.png)](assets/uploads/2015/01/e2b.png)

Ellenben gondoljunk bele, hogy egy unatkozó kisovis a 1,5 perces matek leckéje után írt egy script-et a gépén, ami a háttérben fut és másodpercenként jópár lekérést küld cURL-el az oldalunk egy olyan részére, ahol ezt a session ID-t használnánk arra, hogy eldöntsük a felhasználónk bejelentkezett-e és akkor látja a tartalmat, vagy sem és egy egyedi 403-as error oldalra dobjuk. A pláne abban lesz, hogy a fejléc mezőben elküldött cookie-k közé a PHPSESSID értékét dinamikusan változtatja, magyarán a kis piszok brute force-al próbál egy olyan session id-t találni, ami valakihez tartozik és a cURL által kapott válaszok hash-ét összehasonlítgatva bizony hamar rá is jön, ha olyat talál ami egy bejelentkezett felhasználónkhoz tartozik, mivel a kimenet ott nem a 403-as hibaoldal (vagy akármi más) lesz.

A probléma abban rejlik, hogy a php által generált és sütik közt elhelyezett session ID alapesetben elég rövidke ahhoz, hogy túléljen egy brute force támadást. A megoldás kulcsa pedig az lesz, ha külön ellenőrzés alá vetjük a dolgot:

Generálunk valami cifra session ID-t, mégpedig úgy, hogy hasheljük a felhasználónk IP-jét, User Agent-jét, a timestampet és esetleg megsózzuk\*.

```
<pre data-language="php">define('SESSION_SALT', 'EzIttenASó12%+!#');
$quiteSaferSessionId = sha2($_SERVER['USER_AGENT'].$_SERVER['REMOTE_ADDR'].time().SESSION_SALT);
```

> Salt (só): A jelszavakban és egyéb egyirányú kriptográfiai eljárásokkal titkosított tartalmakban alkalmazott fix karakterlánc, ami matematikailag megnehezíti annak a hashelt tartalomnak a brute force technikával való feltörését. A dolgot úgy kell elképzelni, hogy egy karakterláncot fixen hozzáfűzünk, mielőtt titkosítanánk azt, majd összehasonlításkor szintén. Ennek a salt-nak titkosnak és lehetőleg bonyolultnak kell lennie.

Na de ha megvan ez a szép hosszú session ID, akkor mégis hogy lehetne ezt validálni? Hát először is a hosszával, mivel ez más algoritmussal lett generálva. Aztán ennek is létrehozunk egy táblát az adatbázisban, a már említett változókkal és a belőlük generált session ID-vel. A timestamp csak a session élettartamára vonatkozik, itt ellenőrízhetjük, hogy mikor generáltuk és ha esetleg lejárt a munkamenet, akkor törölhetjük azt és átirányíthatjuk a felhasználónkat a login oldalra. A többi értéket is összevetjük és ha eltérés van, akkor bizony invalid a session, töröljük azt.

Több session-t is rendelhetünk ilyen módon egy adott felhasználóhoz és később annak profiloldalán lehetőséget biztosíthatunk, hogy kiléptessük azt az egyes eszközökről, anélkül, hogy attól kellene tartanunk, valaki bruteforce-al ellopja a felhasználónk identitását.

A fenti támadási formák némileg összefolynak, ezért nehéz külön beszélni róluk (ahogy pl. a session fixationről), mivel az egyes sebezhetőségek új és új utakat nyitnak meg más támadási formák számára.