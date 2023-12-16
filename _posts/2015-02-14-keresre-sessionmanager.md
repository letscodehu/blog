---
id: 271
title: 'Kérésre: SessionManager'
date: '2015-02-14T12:31:08+01:00'
author: tacsiazuma
layout: post
guid: '{{ site.url }}/?p=271'
permalink: /2015/02/14/keresre-sessionmanager/
dsq_thread_id:
    - '3515147498'
    - '3515147498'
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
    - fixation
    - hash
    - hijacking
    - manager
    - php
    - session
---

Az egyik előző [cikkemben]({{ site.url }}/2015/01/30/onvedelmi-gyakorlatok-csrf-es-session-hijacking/) felmerült a kérdés,  
hogy mégis hogy néz ki egy ilyen sessionkezelés a gyakorlatban és mivel ez egy hozzászólás keretein belül nem kivitelezhető, úgy gondoltam akkor egy posztot megérne a dolog.![657252372d6d4d5e9e228618497663ca526a59f9](assets/uploads/2015/02/657252372d6d4d5e9e228618497663ca526a59f9.png)

Álljon itt hát egy komplett implementációja egy sessionmanager osztálynak:

```
<pre data-language="php">class SessionManager extends Singleton { // a singleton osztályból örökölt osztályainkat csak a getInstance() statikus metódussal tudjuk meghívni, lásd singleton-os cikkem.

    const COOKIE = 'azEnFenemodEgyediSessionCookiem'; // ez lesz a session_cookie-nk neve
    const SESSIONSALT = 'ideIsTehetünkValamit';
    const SESSIONTTL = 3600;
    protected function __construct() { 
         // ha az adatbázisba is nyulkálunk, akkor itt inicializáljuk azt
         if (!$this->isValid())  // ha a session invalid, akkor újat indítunk
               $this->newSession();
         else                   // ha validnak bizonyult, akkor visszatérünk
               $this->resumeSession(); 
    }
```

Nézzük eddig mit is csináltuk! Itt egy SessionManager osztály, ami a Singleton osztály leszármazottja, ennélfogva direkt módon nem példányosítható, csak a SessionManager::getInstance() statikus metóduson át, mivel csak egy példány lesz belőle. Lesz egy osztálykonstansunk, amiben definiáljuk a session\_cookie-nk nevét, valamint egy salt-ot, amit a sessionId hash-ének generálásakor használhatunk.

> Ha a fentiek bármelyikét megváltoztatjuk, akkor az kijelentkezteti majd az összes user-t.

Ezután még definiálunk egy sessionttl nevű konstanst, ami a munkamenetünk hosszát adja meg másodpercben. Ez jelenleg 1 órásra lesz belőve, de ez a beállítás csak akkor érvényes, ha bejelentkezéskor nem pipáltuk be a "bejelentkezve maradok" jelölőnégyzetet.

A konstruktorunk következik ez alatt (ami a singleton behaviour miatt protected ugye), amiben meghívjuk az isValid metódusunkat és ennek false visszatérése esetén új session-t kezdünk a newSession()-el, true esetében pedig visszatérünk egy már megkezdett session-höz. Ha az adatbázisba is nyulkálunk, akkor azt szintén itt tudjuk inicializálni, lehetőleg az isValid meghívása előtt, mivel ez a függvény majd igényli azt.

```
<pre data-language="php">    private function isValid() { // ez a függvényünk validálja a session dolgait
         // megnézzük, hogy rendelkezésre áll-e a session cookie-nk
         if (!$this->sessionCookieSet())
             return false;
         elseif(!$this->sessionCookieValid()) // ha igen, megnézzük az valid-e
             return false;  
         else return true;
    }
```

Az isValid metódusunkban megnézzük, hogy egyáltalán rendelkezésre áll-e a session cookie-nk és ha igen, akkor továbbadjuk a validálási folyamatot a sessionCookieValid metódusnak.

```
<pre data-language="php">    
    private function sessionCookieSet() {
           return isset($_COOKIE[self::COOKIE]); // ha van az általunk megadott cookie, akkor true-val tér vissza
    }
```

Ez egy elég szimpla metódus.

```
<pre data-language="php">    private function sessionCookieValid() { // mostmár tudjuk, hogy van cookie, a kérdés az, hogy a hossza stimmel-e     
         if (!strlen($_COOKIE[self::COOKIE]) != 40)
             return false;
         // a hossz stimmel, nézzük meg az adatbázisban, hogy találunk-e hozzá tartozó rekordot.
         elseif (!$this->dbRecordFound()) // nem találtuk meg a hozzá tartozó rekordot
             return false;
         elseif (!$this->sessionIsRecent()) // megnézzük, hogy a session nem járt-e le
             return false;
         elseif (!$this->hashMatch()) // itt már a konkrét hash-eket vetjük össze, ha nem egyeznek, false, ha igen, akkor true-val térünk vissza
             return false;
         else return true;
    }
```

A validálás további részében leellenőrízzük az id hosszát, ha az megfelel, megnézzük, hogy az adott id megtalálható-e az adatbázisban. Ha igen, akkor megnézzük, hogy a nem járt-e le, majd legvégül az id-t nézzük meg, hogy megfelelő-e.

```
<pre data-language="php">    private function dbRecordFound() {
             // itt rákeresünk az adott ID-re az adatbázisban, és ha a talált sorok száma 1, akkor jók vagyunk, ellenkező esetben false-al térjünk vissza.
    }
```

Az adatbázis táblában az id alapján keresünk, itt ha mindent jól csináltunk, akkor csak egy mező fog maximum az adott id-hez tartozni.

```
<pre data-language="php">    private function sessionIsRecent() {
             // az id-hez tartozó adatbázis rekordra $record-ként fogok hivatkozni
             if (!$record['keep_me_logged_in']) // nem állítottuk be, hogy tartson minket bejelentkezve
                  if (($record['start_time'] + self::SESSIONTTL) < time())
                      return false; // ha már lejárt a megadott idő, akkor a sessionünk régi, kijelentkeztetjük. Ide betehetünk egy 5 perces határt, amit ajax-on lekérhetünk és figyelmeztethetjük a userünket, hogy újítsa meg a session-t, de most nem bonyolítom
             else return true; // ha bejelentkezve maradunk vagy még nem évült el a munkamenet, akkor true-val térünk vissza
    }
```

Itt sessionünk élettartamát vizsgáljuk. Ha bejelentkezve tartjuk a userünket, akkor nincs vele macera, ha nem, akkor az időtartamot vizsgáljuk.

> Az adott rekordban keep\_me\_logged\_in mező csak akkor kap true értéket, ha bejelentkezett userről van szó. Mindenkihez rendelünk session-t, akár bejelentkezett, akár nem, hiszen pl. egy webáruházban lehet válogatni dolgokat akkor is, ha még nem is regisztráltunk.

```
<pre data-language="php">    private function hashMatch() { // na itt történik a konkrét mágia
            // lekérjük a rekordot ami ide tartozik, $record névvel fogok rá hivatkozni
             $stringToHashed = $record['timestamp'].$_SERVER['REMOTE_ADDR'].$_SERVER['USER_AGENT'].self::SESSIONSALT; // az adatbázisban szereplő időt használjuk, hiszen az id generálásakor is azt használtuk. Az IP címből használhatjuk csak az első tagot, az ritkán változik, de legalább koreából nem próbálkoznak be, de akár ezt is és a user agentet is kihagyhatjuk belőle.
             if ($_COOKIE[self::COOKIE] !== hash('sha512', $stringToHashed)) // akármilyen hashelési (akár kétkulcsos) eljárást használhatunk.
                  return false;
             else 
                  return true;
    }
```

Itt vetjük össze a konkrét hash-eket, amik az sessionid-t adják. Ez az a rész, ahol mindenki testreszabhatja mennyire megy el a user-ek kényelme és mennyire a biztonság felé.

```
<pre data-language="php">    private generateSessionId() {
         $time = time();
         $id = hash('sha512',$time.$_SERVER['REMOTE_ADDR'].$_SERVER['USER_AGENT'].self::SESSIONSALT);
         // majd beírjuk a dolgokat az adatbázisba.
         return $id;
    }
```

Itt generáljuk a session ID-t és itt fogjuk beírni az adatainkat az adatbázisba.

```
<pre data-language="php">    private function newSession() {
        session_name(self::COOKIE); // belőjük a sessionünk nevét
        session_id($this->generateSessionId); // generálunk neki egy egyedi ID-t
        session_start(); // elindítjuk a session-t
        session_unset(); // minden session-ben tárolt változót törlünk a biztonság kedvéért.
    }
```

Új session-t készítünk, beállítjuk a nevét, az id-t és elindítjuk, valamint MINDEN változót törlünk ami a sessionhöz tartozik.

```
<pre data-language="php">    private function resumeSession() {
        session_name(self::COOKIE); // belőjük a session cookie nevét
        session_start(); // elindítjuk a session-t
        // they see me rollin', they hatin'
    }
}
```

Itt visszatérünk egy már meglévő munkamenethez.  
Összességében ennyi lenne egy leegyszerüsített SessionManager osztály, amit aztán testreszabhatunk a saját igényeinknek megfelelően, tárolhatjuk a sessionök adatait SQL, NoSQL adatbázisban, eldönthetjük mit tárolunk az adott userről, statisztikát alapozhatunk ezekre az adatokra, stb.

Remélem érthető volt a cikkem és segít mindenkinek elindulni a saját munkamenet-kezelésében!