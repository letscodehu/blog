---
id: 1413
title: 'OAuth 2.0 Apigility módra'
date: '2016-12-22T11:24:40+01:00'
author: tacsiazuma
layout: post
guid: '{{ site.url }}/?p=1413'
permalink: /2016/12/22/oauth-2-0-apigility-modra/
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
image: 'assets/uploads/2016/12/09202342/3343062926_4e65c72b65_o.png'
categories:
    - PHP
    - Zend
tags:
    - api
    - apigility
    - authorization
    - oauth
    - rest
    - zend
---

Habár legutóbbi [cikkemben]({{ site.url }}/2016/12/19/konstrualjunk-web-api-t-3-resz/) a Laraveles Passportot ígértem, gondoltam teszek egy próbát az Apigility átlal biztosított OAuth2.0-ás authentikációval is, részben azért, mert a B. Shaffer féle Oauth2 csomagot használja, amivel már korábban volt dolgom. Akkor überszívás volt mindezt rendesen életre lehelni, vagy legalábbis a rendszer nem éppen illett bele az egészbe, sok helyen kellett átszabni a protokollt (sokan ezért is szidják az OAuth 2.0-t a SAML-al szemben, ugyanis nagyon sok lyuk van a specifikációban, ahol többféle implementáció fordulhat elő, ami miatt lehet, hogy két fél megfelel a protokoll minden követelményének, mégis inkompatibilisek lesznek), így hát kiváncsi voltam, lehetséges-e mindezt úgymond összekattintgatni. Előljáróban annyit, hogy azért nem volt olyan egyszerű, mint hittem 🙂[![](assets/uploads/2016/12/auth-oauth2-web-server-app.png)](assets/uploads/2016/12/auth-oauth2-web-server-app.png)

Akkor most kellene előhalászni azt a csomagot, amit összeraktunk az [első API-s cikk]({{ site.url }}/2016/08/26/konstrualjunk-web-api-t/) során, mert onnan folytatjuk a dolgot, habár az csak a teszteléshez lesz szükséges. Ha nincs meg, az sem baj, [itt](assets/uploads/2016/12/apigility.tar.gz) egy tömörített verzió, de vigyázat ezt már tegnap megsütöttem. Ha behozzuk az admin felületet, akkor az Authentication fülön tudunk új hitelesítési adaptert hozzáadni az oldalhoz:

[![](assets/uploads/2016/12/Selection_075.png)](assets/uploads/2016/12/Selection_075.png)

A felugró popupnál választhatunk több módszer közül, mi most maradjunk a rendes mysql-es verziónál (habár optionalnek tűnhetnek a mezők a placeholderekkel, sajna mindegyik required):[![](assets/uploads/2016/12/Selection_076-294x300.png)](assets/uploads/2016/12/Selection_076.png)

Ha ezzel megvolnánk, akkor azt hinnénk, hogy kész is minden, ámde okkal használ adatbázist a drága, viszont a migrációt lefuttatni bizony smafu, úgyhogy keressük elő kézzel a

```
vendor/zfcampus/zf-oauth2/data/db_oauth2.sql
```

fájlt, majd importáljuk az adatbázisunkba.

Válasszuk ki a korábban készített service-ünket és rendeljük hozzá az authentikációt:

[![](assets/uploads/2016/12/Selection_077-300x139.png)](assets/uploads/2016/12/Selection_077.png)

Toljunk rá egy mentést és láss csodát!... nem történt semmi, ugyanis az egyes resource-oknál meg kell határozni, hogy mely HTTP methodokra akarjuk ráereszteni az authentikációt, amit itt beállítottunk. Nézzük először a bejegyzéseket:

[![](assets/uploads/2016/12/Selection_078-300x192.png)](assets/uploads/2016/12/Selection_078.png)

Ez nem egy szokványos módszer, ugyanis általában a módosítást szokták jogosultsághoz kötni, de most a teszt kedvéért ez a legegyszerűbb, így nem futhatnunk 422-es errorba és hasonlókba. Ha most meghívjuk POSTmanből az endpointot, akkor biza csúnya 403-at kapunk:

[![](assets/uploads/2016/12/Selection_079.png)](assets/uploads/2016/12/Selection_079.png)

A rendszer annyiban segít, hogy idéz nekünk egy passzust a bibiliából, azonban az nekünk nem sokat segít. A 403-at biza azért kaptuk, mert nem küldtünk Authorization headert. Hát persze, hogy nem, hiszen még nem kaptunk tokent. Na de mégis hogy kapunk majd?

Na itt jönnek elő az előző cikk emlékei. Mi most egy 2-legged Oauth-ot szeretnénk, amihez első lépésben kell egy ún. `client_id` és `client_secret`. Ezeket pedig az OAuth-nál kell felregisztrálni. Igen, jól sejted, a migrációs scriptben voltak ilyen táblák. Igen, azt is jól sejted, hogy most az tök üres. Nem, nincs rá az Apigility-ben CLI tool, amivel fel tudnánk ezt venni, így kézzel kell beoktrojálni azt:

```
INSERT INTO `oauth_clients` (`client_id`, `client_secret`, `redirect_uri`, `grant_types`, `scope`, `user_id`) VALUES
('testclient', '$2y$10$RnnxbJ4ix9pfLjDfD0xxUungjKBIZcX.NqlWUB9MnHvYuDXeycZ2e', 'http://apigility.localhost.hu/oauth/receivecode', NULL, NULL, 'testuser');
```

Egy sort kell felvenni, amiben megadtuk, hogy a kliensünk id-je a `testclient` lesz, a secret az alábbi bcrypt-el hashelt `testpass`, a redirect\_uri, amire visszaredirektál bennünket az authorizációs kóddal pedig a fenti URL, ami az apigility defaultja. Ha nem csak teszteljük, akkor ebből kell majd sajátot írnunk például, mert ez csak szimplán kiírja a kódot, amit utána még más infókkal vissza kell POST-olni, de ne rohanjunk előre.

[![](assets/uploads/2015/10/whyudodis.png)](assets/uploads/2015/10/whyudodis.png)

Felvettük ezeket (értelemszerűen aki PHP szerverrel futtatja, az a localhost:8888 hostra mutató linket adjon meg itt), mi a következő lépés? Hát kérjük el az OAuth-tól a kódot:

```
http://apigility.localhost.hu/oauth/authorize?client_id=testclient&response_type=code&state=xyz&redirect_uri=http://apigility.localhost.hu/oauth/receivecode
```

Lőjük meg a fenti URL-t böngészőben. A következő csodás kép fog fogadni:

[![](assets/uploads/2016/12/Selection_080.png)](assets/uploads/2016/12/Selection_080.png)

Hát persze, hogy engedélyezzük! Ha elfogadtuk, akkor vissza leszünk redirectálva a megadott URL-re, ahol ez fogad:

[![](assets/uploads/2016/12/Selection_081.png)](assets/uploads/2016/12/Selection_081.png)

Ezek ugye default tesztoldalak, szóval ne így képzeljük majd el az éles használatát, viszont ki tudjuk próbálni a flow-t, tehát amennyiben szerveroldali alkalmazásunk van, akkor az előző oldalra nem engedünk oda egyből bárkit. Ne feledjük az auth szerver az egyetlen, ahol a felhasználók be tudnak lépni felhasználónév/jelszó párossal, tehát a login oldalak ott lesznek (megelőzve a fenti authorize request oldalt). Térjünk azonban vissza a fenti válaszra. Láthatjuk, hogy itt vissza lettünk irányítva, megkaptuk a kódot. Ha ezt mi írtuk volna meg, akkor már küldenénk is a háttérben egy POST kérést backendről, a leírtaknak megfelelően és az alábbi választ kapnánk:

```
{"access_token":"f48a73fba306dac07c6a694fadcbe25c2ca1593f","expires_in":3600,"token_type":"Bearer","scope":null,"refresh_token":"a9f4b7f477be8aeb46155991bdd51d7c6516e23a"}
```

Láthatjuk, hogy kaptunk egy access\_token-t, refresh\_token-t, amik 3600 másodperc, azaz kerek egy óra alatt lejárnak. A scope jelen esetben null, vagyis nem rendeltük hozzá semmihez a tokent, de lévén az apigility felületén nem tudjuk megadni, hogy mely resource-ok mely scope-okhoz tartoznak, így ez jelen esetben tárgytalan. Viszont tegyünk egy próbát a fenti tokennel és nézzük meg most mi is a válasz az alábbi kérésre:

```
curl -X GET -H "Accept: application/json" -H "Authorization: Bearer f48a73fba306dac07c6a694fadcbe25c2ca1593f" \
 "http://apigility.localhost.hu/posts"
```

Láthatjuk, hogy a headerbe bekerült a token, sima GET kérés és bumm, csak úgy dőlnek felénk a bejegyzések 🙂

[![](assets/uploads/2015/12/pope-christmas-gays.jpg)](assets/uploads/2015/12/pope-christmas-gays.jpg)

Viszont a fenti megoldás sajnos nem igazán jó, ha JavaScript alapú alkalmazást akarunk, de szerencsénkre ezen még tudunk segíteni.

Ahhoz, hogy ez működjön be kell kapcsolnunk az ún. implicit grant\_type-ot a `config/autoload/local.php`-ben:

```
return [
 'zf-oauth2' => [
 // ...
 'allow_implicit' => true,
 // ...
 ],
];
```

Az implicit grant type azért fontos, mert lévén frontenden vagyunk, nem tudjuk biztonságosan tárolni a client\_secret-et. A kérés, amit indítunk nagyban hasonlít majd az authorizációs kódoshoz, azzal a különbséggel, hogy itt rögtön a tokennel tér vissza a szerver, amit rögtön használatba is tudunk majd venni. Persze mielőtt azt hinnénk, hogy ezáltal minden biztonság oda, egy sima client\_id-t meg kibányászunk az oldalból, azt ne feledjük el, hogy itt is van egy redirect\_uri, ami korlátozza a visszaéléseket.[![](assets/uploads/2016/12/auth-oauth2-browser-based.png)](assets/uploads/2016/12/auth-oauth2-browser-based.png)

A kérés így néz ki ebben az esetben:

```
```http
<span class="token keyword">curl -X GET "http:</span>//apigility.localhost.hu/oauth/authorize?response_type=token&client_id=testclient&redirect_uri=http://apigility.localhost.hu/oauth/receivecode&state=xyz"

```
```

Ami kérés egy ugyanolyan authorize oldalat eredményez:[![](assets/uploads/2016/12/Selection_080.png)](assets/uploads/2016/12/Selection_080.png)

Az allow-ra kattintva pedig redirektál minket ide:

```
http://apigility.localhost.hu/oauth/receivecode#access_token=c59315b201ffc917e9fb4e7a8a52e4ef699072c4&expires_in=3600&token_type=Bearer&state=xyz
```

A tokent megkapjuk hashmark paraméterként, amit kliensoldalon az alábbi kóddal tudjuk kiszedni (persze léteznek erre jobb módszerek, nyílván :D):

```
// function to parse fragment parameters
var parseQueryString = function( queryString ) {
 var params = {}, queries, temp, i, l;
 // Split into key/value pairs
 queries = queryString.split("&");
 // Convert the array of strings into an object
 for ( i = 0, l = queries.length; i < l; i++ ) {
 temp = queries[i].split('=');
 params[temp[0]] = temp[1];
 }
 return params;
};
// get token params from URL fragment
var tokenParams = parseQueryString(window.location.hash.substr(1));
```

Ezután a tokent már csak a korábbiakban is említett módon bele kell fűzzük az Authorization headerbe és bumm, így lett a chocapic!

Viszont hiába a kétféle megközelítés, továbbra is felmerülhet bennetek a kérdés, persze joggal, hogy mégis hogy jön itt képbe a user, azaz a resource owner, mert a példák egyikében sem láttunk egyetlen helyet, ahol a korábban emlegetett username/password-ot kellett volna beírni. Ez teljesen valid, mivel a fentiek arra az esetre érvényesek, mikor nincs külön user, hanem a resource owner egyben a kliens. De mégis kérem hol van ilyen példa?

Vegyünk pl. egy Google Cloud Messaginget (ami időközben átalakult Firebase Cloud Messaginggé). Az alkalmazásunk fogja meghívni azt az endpointot, a saját tokenjével, nem pedig a userekével (olyanokat is küld, de azok másfajta célokat szolgálnak). Ebben a helyzetben az alkalmazásunk lesz a kliens és a resource owner is egyben, a GCM lesz az API, ami mindezt kiszolgálja.[  
![](assets/uploads/2016/12/Wat8.jpg)](assets/uploads/2016/12/Wat8.jpg)

Viszont, ha egy Facebook/Twitter példát nézünk, akkor némileg más a helyzet. A fenti példában nem a felhasználónk kerül átirányításra a Google felé, hogy belépjen a mi felhasználónkkal és utána rányomjon az `allow` gombra, hanem az elején, mikor összelőjük a dolgokat, akkor nekünk kell (utána már csak refresheljük a dolgot, vagy nem jár le a token, de ez más kérdés). Figyeltétek a legutóbbi mondatot? **Belép**. Eddig sehol nem volt szó login formokról, márpedig azért, mert azt nekünk kell implementálni és a login form után kézzel ráhívni a `handleAuthorizeRequest` metódust, a plusz userId paraméterrel.

Ez volt az a pont, amikor inkább felhagytam ezzel. A terv az volt, hogy összekattintgatjuk a dolgot, pár apróságon állítunk, de nem így volt, ráadásul nem tudjuk az egyes erőforrásokat szétszeparálni és scope-okhoz rendelni, max. elég sok hegesztés árán, így a következő cikkben megnézzük, hogy a Laravel Passportja vajon mennyiben jobb, mint a fenti módszer?
