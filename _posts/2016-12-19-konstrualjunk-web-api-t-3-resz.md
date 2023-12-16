---
id: 1391
title: 'Konstruáljunk web API-t &#8211; 2. felvonás'
date: '2016-12-19T23:56:57+01:00'
author: tacsiazuma
layout: post
guid: '{{ site.url }}/?p=1391'
permalink: /2016/12/19/konstrualjunk-web-api-t-3-resz/
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
image: 'assets/uploads/2016/12/09202343/big_1450201054_image.jpg'
categories:
    - Architecture
    - Backend
tags:
    - access
    - api
    - backend
    - jwt
    - oauth
    - passport
    - php
    - refresh
    - security
    - token
---

Amikor az ember webről beszél, a legtöbb esetben színes weboldalakat képzel el, ezerféle közösségi platform belépéssel, ahol az ember minden mozzanatát lépésen tudják követni különböző módszerekkel, hogy a leginkább testreszabott élményt kapja. Ha bejelentkezünk egy oldalra, akkor a következő oldalbetöltéskor már az üdvözlő képernyő fogad, azt a hamis érzést keltve, hogy a weboldal tudja, hogy pontosan kik is vagyunk. Ez persze közel sem igaz, csupán a böngészőnk által küldött sütiben szerepel egy session ID, amivel azonosítanak bennünket és ezáltal hozzánk igazíthatják az oldal tartalmát. Ehhez viszont az kell, hogy a böngésző süti ide-oda közlekedjen a kérésekben/válaszokban.

Azt már tudjuk régről, hogy a HTTP az egy ún. stateless protokoll, vagyis a két egymást követő lekérés közt nincs semmiféle kapcsolat, állapotváltozás. Ezt hivatott áthidalni az imént említett sütis megoldás. Azonban amikor REST webservicekről beszélünk, ott ez a sütis módszer nincs jelen. A [korábbi példákban]({{ site.url }}/2016/08/26/konstrualjunk-web-api-t/) ez nem is okozott gondot, hiszen még nem volt szó arról, hogy ki mit is csinálhat az adott REST erőforrásokkal. Viszont mi a helyzet akkor, ha bizonyos műveleteket csak adott jogosultság mellett szeretnénk megengedni? Valamilyen formában tudtára kell adjuk a szervernek, hogy mégis kik vagyunk, ami alapján ő vagy végrehajtja az említett műveletet, vagy egy jól irányzott 401-es válasszal finoman elutasít bennünket. Ilyen műveletek lehetnek pl. azok, amikor törölni akarunk egy elemet, hozzá akarunk adni, módosítani, netán valakinek a privát dolgaiba akarunk kutakodni.

Cikkünkben belepillantást nyerünk abba, hogy mi is az OAuth2.0 protokoll és hogy segíthet nekünk a fentiekben, third party vagy épp a saját API-nk használatakor.[![](assets/uploads/2016/12/3343062926_4e65c72b65_o.png)](assets/uploads/2016/12/3343062926_4e65c72b65_o.png)

Először is jöjjön néhány példa, amivel letisztázzuk, hogy mi is a különbség az authorizáció és authentikáció között.

- Authentikáció (ki vagyok Én?)
- Authorizáció (bemehetek-e a páncélterembe?)
- <span style="text-decoration: line-through;">Terrence Hill (Te mondd, hogy rablótámadás, a Te hangod mélyebb!)</span>

Az alapkoncepció a korábban említett webes esetben egy kéttényezős **authentikáció**, ami legtöbb esetben egy felhasználónév/jelszó **párost** jelent. Ezt elküldjük és a backend valami csodás sessionben eltárolja, amit rólunk tudni kell, pl azt hogy milyen role-t töltünk be a rendszerben, aztán ebből kiszüttyögi, hogy megváltoztathatjuk -e a /etc/passwd fájlt vagy sem. Ez utóbbi folyamat az **authorizáció**.

Na most ez szép és jó, ha a rendszer a sajátunk és közvetlen kapcsolatban állunk a szerverrel. Azonban akadnak esetek, mégpedig jó sok eset, mikor nem ez a helyzet.

Tegyük fel, hogy a felhasználónév/jelszó párosunk egy olyan kulcs, ami mindent nyit, ami a miénk, a házat, a kocsit, a bankszámlát, na meg képes felnyitni a barátnőnk/barátunk szemét is, hogy mennyi időt töltünk a gép előtt, tehát minden jogosultsággal rendelkezik.

Aztán tegyük fel, hogy van egy szolgáltatás, amivel a bankszámlánkat tudjuk menedzselni, de ennek a szolgáltatásnak szüksége lenne a hozzáférésre. A mi "mesterkulcsunkat" mégsem adhatjuk oda, hiszen azzal az adott szolgáltatás simán vissza is élhet a 30 éves Wartburgunkat is nyitó kulccsal, így kell valami alternatívát találni.

A megoldást úgy képzeljük el, hogy elmegyünk a kulcskészítőhöz <span style="text-decoration: line-through;">a mátrixból</span> és megmutatjuk neki a kulcsunkat, amiért ő ad egy másik kulcsot, ami csak a bankunkhoz ad hozzáférést, ott is csak limitált ideig. Aztán ezt a kulcsot odaadjuk a bankos hölgyikének és ő ezzel tud garázdálkodni a nevünkben. Na, ezt a folyamatot a szakma tolvajnyelvén **3-legged OAuth** authentikációnak hívjuk.

Na de mi is az egész OAuth lényege? Mitől lenne ez nekünk jó?

> Az OAuth segítségével úgy tudjuk megosztani a saját kis privát dolgainkat (képeket, videókat, stb.) egy másik oldallal, hogy **annak az oldalnak nem adjuk ki jelszavunkat és felhasználónevünket**.

Már az elején fontos leszögeznünk, hogy az OAuth nem segít biztonság szempontjából, tehát ha plaintext küldünk el valamit, az OAuth mellett is plaintext marad, ennélfogva nem mentesít az SSL és hasonlók alól.[![](assets/uploads/2016/12/big_1450201054_image-1024x604.jpg)](assets/uploads/2016/12/big_1450201054_image.jpg)

Na de nézzük csak hogy is épül fel az egész!

Az OAuth standard három különböző szerepkört határoz meg:

- client (Third-party application)
- server (The API)
- resource owner (User)

A hagyományos kliens-szerver modelben (amit ugye a [RESTful API]({{ site.url }}/2016/08/26/konstrualjunk-web-api-t/)-knál is használunk) a kliens használja a saját hitelesítő adatait, hogy elérje az erőforrásokat egy szerveren. A hitelesítő adatok a klienshez tartoznak, a szervert nem érdekli, hogy az honnan is jött, vagy a hitelesítő adatok valóban a klienstől jöttek-e, amíg megegyeznek azzal, amit vár, a kérést teljesíti.[![](assets/uploads/2016/12/compare-5-300x209.png)](assets/uploads/2016/12/compare-5.png)[  ](assets/uploads/2016/12/clientserver.png)

Akadnak esetek azonban, amikor a kliens másvalaki nevében akar tevékenykedni. Amikor ilyen helyzet áll fent, akkor egy felhasználó használja az adott klienst, és a kliens a felhasználó nevében akar cselekedni.

Ilyenkor **a kliens nem a saját hitelesítő adatait fogja használni, hanem az adott felhasználójét**, ez legtöbbször egy felhasználónév/jelszó páros lesz.

Akkor most menjünk kicsit gyakorlatiasabb irányba, mégpedig úgy, hogy képzeljük el, a klienst mint egy webes alkalmazás, aminek a frontendje a felhasználó gépén fut, a backendje pedig egy szerveren.

Na most a probléma ott kezdődik, hogy az imént mondtuk, hogy egy weboldal szeretné használni a mi felhasználónkat, ahhoz hogy egy másik weboldalon végezzen ezt-azt. Mi garantálja, hogy nem élnek vissza vele?

Először nézzük mi is a helyzet, ha már egy kész API-t akarunk használni (az API és az Oauth server lehet külön is, de most egyszerűsítünk). Tegyük fel, hogy van egy alkalmazásunk, amivel a felhasználóink le tudják kérdezni a bankszámlájukhoz tartozó számlatörténetet. Ez az alkalmazásunk használja majd a bank serverét, a felhasználó (resource owner) nevében. Ahhoz, hogy ezt meg tudja tenni, be kell regisztrálnunk a szervernél. Ehhez meg kell adnunk pár alap információt: app neve, weboldal, logó, stb. Ami nagyon fontos, hogy meg kell adni a redirect URI-t, amire visszaredirektálja a felhasználókat.

A redirect URI azért fontos, mert csak erre redirektálhat vissza a rendszer, ráadásul meg szokták követelni, hogy biztonságos protokollon történjen, https-el, de majd erre is visszatérünk.

Amikor az alkalmazásunkat regisztráljuk, kapunk egy clientID-t és egy client\_secret-et. Az előbbi egy publikus információ, az utóbbi viszont titkos.

Az OAuth folyamat első lépése az ún. authorizáció. A böngészős alkalmazásoknál ez úgy történik, hogy a szerver biztosít egy UI-t a felhasználó számára, ahol engedélyezheti az elérést.

Amikor a felhasználó be akar lépni a weboldalunkra, akkor a Login gomb megnyomásával átirányítjuk a felhasználót egy ilyen URL-re:

```
https://bank-oauth2-server.com/auth?response_type=code&client_id=CLIENT_ID&redirect_uri=REDIRECT_URI&scope=reports
```

Az URL-ben átadtuk hogy egy ún authorization code-ot várunk vissza, a client\_id-t hogy tudja kiről is van szó, valamint egy redirect\_uri-t és megadtuk, hogy a riportokhoz szeretnénk hozzáférni.

A szerver erre a kérésre ellenőrzi, hogy létezik-e a megadott client\_id és a hozzá tartozó redirect\_uri is megfelelő-e, ha igen, akkor megjelenít a felhasználónak egy hasonló felületet:[![](assets/uploads/2016/12/Selection_073.png)](assets/uploads/2016/12/Selection_073.png)

Ha a felhasználó arra kattint, hogy elfogadja a kérést, akkor a szerver a kapott redirect\_uri-ra redirektálja a felhasználót, de GET paraméterként megkapjuk az authorizációs kódot:

```
https://bank-oauth2-client.com/callback?code=AUTH_CODE
```

Erre a lépésre azért van szükség, mert a GET paraméterek között nem adhatjuk ki a client\_secret-et. A szerveren egy authorization\_codes táblába (vagy épp ami a datastore) letárolja ezt a kódot és a hozzá tartozó client\_id/user\_id párost.

Ez a felület már általunk íródott, úgyhogy itt megint átvesszük az irányítást és a kapott kóddal küldünk egy POST kérést a szerverünkről:

```
POST https://api.bank-oauth2-server.com/token
 grant_type=authorization_code&
 code=AUTH_CODE&
 redirect_uri=REDIRECT_URI&
 client_id=CLIENT_ID&
 client_secret=CLIENT_SECRET
```

Ha minden rendben, akkor a szerver egy access\_tokennel válaszol cserébe:

```
{
 "access_token":"RsT5OjbzRn430zqMLgV3Ia"
}
```

kivéve, ha valami hiba volt:

```
{
 "error":"invalid_request"
}
```

A fent kapott access\_tokennel pedig az adott user nevében tudunk betyárkodni, DE csak a report scope alá eső műveleteket, na de mégis hogy?

A kéréseink Header mezői közé kell felvennünk azt:

```
GET https://api.bank-oauth2-server.com/reports/me
Authorization: Bearer RsT5OjbzRn430zqMLgV3Ia
```

Ezzel a szerver megkapja a tokent, megnézi a saját adatbázisában, hogy milyen scope-okkal rendelkezik, mi is az adott kéréshez szükséges scope és annak függvényében válaszol vagy sem.

Bumm, ennyi volt az egész! Egyszerűnek tűnik, ugye?

Viszont maga az OAuth2 server már közel sem lesz ilyen egyszerű. A következő cikkben megnézzük milyen lehetőségeink vannak PHP-vel, mégpedig kipróbáljuk a Passport modulját a Laravel 5.3-nak és mélyebbre ásunk a rendszer működésébe, hogy mi miért is történik!