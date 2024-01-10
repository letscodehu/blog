---
id: 1665
title: 'A dummy, a spy, és a tíz kicsi stub'
date: '2020-01-09T21:34:33+01:00'
author: tacsiazuma
layout: post
guid: '{{ site.url }}/admin/?p=1665'
permalink: /2020/01/09/a-dummy-a-spy-es-a-tiz-kicsi-stub/
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
amazonS3_cache:
    - 'a:3:{s:64:"//www.letscode.huassets/uploads/2018/06/dummy-spy-stub.jpeg";a:2:{s:2:"id";s:4:"1666";s:11:"source_type";s:13:"media-library";}s:102:"//d1nggucqgkhstg.cloudfront.netassets/uploads/2018/06/09202505/dummy-spy-stub-e1579714101123.jpeg";a:2:{s:2:"id";s:4:"1666";s:11:"source_type";s:13:"media-library";}s:73:"//www.letscode.huassets/uploads/2018/06/dummy-spy-stub-1024x413.jpeg";a:2:{s:2:"id";s:4:"1666";s:11:"source_type";s:13:"media-library";}}'
image: 'assets/uploads/2018/06/09202505/dummy-spy-stub-e1579714101123.jpeg'
categories:
    - Backend
    - Java
    - Testing
tags:
    - dummy
    - mock
    - spy
    - stub
---

**TL;DR**

**Dummy:** placeholder. **Stub:** metódusok visszatérési adatokkal előprogramozva. **Spy:** olyan stub, ami képes figyelni a felparaméterezett metódushívásokat. **Mock:** olyan spy, ami ellenőrzi is a hívások számát. **Fake:** egy működő, gyorsított implementáció.

Tudod mi a különbség a mock és a stub között? Mi jön létre, amikor meghívod a kedvenc mocking keretrendszered **createMock** metódusát? Egy mockot köp ki? Biztos vagy benne? Hidd el a legtöbb fejlesztő nem fogja tudni erre a kérdésre a választ (és nem azért, mert egyáltalán nincsenek tesztjeik azon a projekten, hagyjuk figyelmen kívül most őket). Az ok minderre annyi, hogy az emberek szokásokat követnek. Ezek a szokások pedig a már kódbázisban levő teszteken alapulnak. *„Tartanunk kell magunkat a már meglévő konvenciókhoz”*, mondogatják. *„Nincs leírva sehol, hogy mindent ellenőrízni kellene, de hát a dolgoknak így kell lennie”*.

Az emberek félnek attól, hogy bugokat hozzanak létre. Sajnos ez az, amit teszünk az időnk nagy részében, még ha nem is vagyunk ezzel tisztában. Senki sem akar bugokat javítani. Senki se akar felkerülni a csapata szégyenfalára. Ráadásul akadnak olyan cégek is, amik jutalmazzák azokat akik a hibák számát egy határérték alatt tartják.

### Minden a számokról szól.

Tehát ott kötünk ki, hogy minden egyes metódushívást ellenőrízni fogunk, csak azért, hogy biztosak legyünk benne, hogy az 100%-osan megfelelően működik. A probléma ott van, hogy sokan úgy gondolják, hogy a 'megfelelően' működik azt jelenti hogy a **megfelelő implementáció**val és nem a **megfelelő állapot**tal. A másik probléma, hogy hiába ellenőrzöd le, hogy minden metódushívás megfelelően lezajlott, ez nem fog segíteni azon, hogy hibák legyenek a rendszerben:

### mert a tesztek nem erről szólnak, ez csupán egy mellékhatásuk.

Na de térjünk vissza az eredeti témához és kezdjük az alapokkal. Beszéljünk arról, hogy mivel is tudjuk az eredeti implementációkat helyettesíteni. Van pár típusuk, név szerint: dummy, stub, mock, spy és a fake.

**Dummy**: ezek pontosan azok, amire a nevük is utal. Csak a helyet foglalják. Amikor szükséged van egy paraméterre valahol, ami egy meghatározott típusú, akkor erre lesz szükséged. Attól függően, hogy milyen nehéz példányosítani az adott osztályt, használhatsz egy valódi példányt, vagy a keretrendszer biztosíthat lehetőséget erre. Gyakran egy null érték is elegendő a feladatra. Az ökölszabály az, hogyha nehéz példányosítani, akkor inkább a keretrendszer segítségével hozzunk létre egyet. Bizonyos esetekben még ellenőrzéseket is hajtunk rajtuk végre, hogy biztosra menjünk, csak azért hozzuk létre és adjuk át őket, mert különben fordítás vagy futásidejű problémánk lenne. Tehát mikor meghívunk egy metódust egy ilyen objektumon, akkor bizony az nem elvárt működés, kivételt is dobunk:

```
```
class <strong class="markup--strong markup--pre-strong">DummyOrder</strong> extends <strong class="markup--strong markup--pre-strong">Order</strong> {
  @Override
  void <strong class="markup--strong markup--pre-strong">applyDiscount</strong>(){
    throw new RuntimeException();
  }
}
```
```

Ez egy leszármazott típusa az eredetinek, amiben felülírtuk az egyetlen metódust, hogy biztosra menjünk, senki nem hívja meg azt.

Hogy megválaszoljuk a fentebbi kérdést is: amikor meghívod a createMock metódust, akkor egy dummy-t kapsz vissza. Semmi viselkedés, semmi adat nincs benne. Egy szimpla objektum, aminek a metódusai null értékkel térnek vissza.

**Stub**: Rendben, tehát itt van a kollaborátorunk, tegyük fel, hogy valami factory és meghívjuk a create metódusát. Viszont korábban azt mondtuk a dummi esetén, hogy minden metódus nullt vagy primitív értékkel tér vissza. Viszont nekünk most egy valódi objektum kell, mert különben a következő sorban már kapjuk is a nullpointert. Egy pillanattal később már egy kollégád meg is jelenik egy kávéval és valami olyan tanáccsal, mint *"Hallod, használd az **expect** metódusát az EasyMocknak... de ne felejtsd el ellenőrízni minden metódushívást a teszted végén, különben nem lehetsz biztos benne, hogy meghívódott és... "*. Na jó, elég ebből, ignoráljuk most ezt az utóbbit. Tehát a stub az nem más, mint egy olyan dummy, aminek előre feltöltöttük a metódusait adattal. Felprogramozzuk, hogy *"amikor ez a metódus meghívódik, akkor add vissza ezt az objektumot amit az imént kaptál"*. Ha ez egy szimpla factory, akkor simán leszármaztathatod a tesztedben (legalábbis Javaban) és beleégetheted azt az egy értéket, amit szeretnél visszaadni belőle. De miért foglalkozunk ennyit a visszatérési értékekkel? Azért, mert azt akarjuk, hogy a tesztjeink determinisztikusak legyenek. Tehát akármikor futtatjuk a tesztet és az meghívja az előbb stubolt metódust, az mindig ugyanazzal az értékkel fog visszatérni, újra és újra. Kérdezhetnéd, hogy *"Miért tennék ilyet?".* Nos azért, mert ha a benetek változnak, de a kimenetek vagy a viselkedésbeli elvárások nem, akkor bizony törékeny, környezettől függő tesztekkel végzed. Tegyük fel, hogy tesztelni akarod az előfizetéseket. Minden rendben megy, egészen 2018-ig, de utána elkezdenek törni. Mindez csupán azért, mert egy valós DateTime osztályt használtál és 2018 után már kívül esik az előfizetés időtartamán. (Természetesen módosíthatod, hogy az elvárások az inputokhoz képest relatívak legyenek, de ez megint csak nyűg lenne).

```
```
class <strong class="markup--strong markup--pre-strong">FixLocalDateTimeProvider</strong> extends <strong class="markup--strong markup--pre-strong">LocalDateTimeProvider</strong> {
  @Override
  void <strong class="markup--strong markup--pre-strong">get</strong>(){
    return LocalDateTime.of(2018,3,30,10,10,10);
  }
}
```
```

Fentebb egy nagyon egyszerű stub, ami mindig ugyanazt a dátumot adja vissza.

**Mock**: Na és elértünk a nehezéhez. Ismét induljunk ki a dummyból. Emlékeztek még mit is mesélt a kollégánk az imént? Hogy nem lehetünk biztosak abban, hogy egy metódus valóban meghívásra került? Pont arról beszélt, amire a mockokat használjuk. Tehát az a célunk vele, hogy ellenőrízzük azt, hogy bizonyos metódus meghívásra került és extrém esetekben akár a metódusok meghívásának a sorrendjét is. Mikor kell ellenőríznünk a hívásokat? Amikor viselkedést akarunk ellenőrízni? Na és ezt mikor csináljuk? Amikor nem tudunk állapotot ellenőrízni.

Tegyünk egy kis kitérőt most és beszéljünk ezekről az ellenőrzésekről. Tehát az állapot ellenőrzés, vagy idegen szóval state verification, az amikor bele tudunk nézni az objektumaink belsejébe és meg tudunk fogalmazni bizonyos elvárásokat. Vegyünk egy egyszerű példát, mondjuk egy settert. Megvizsgálhatnánk a tényleges metódushívást egy mock segítségével (ami viselkedés ellenőrzés, azaz behaviour verification), de meghívhatnánk az adott mezőhöz tartozó gettert is és megvizsgálhatnánk mit ad vissza, hogy ellenőrízzük. Természetesen sosem ellenőrzöd a setterek működését közvetlenül, de a lényeg, hogy a legtöbb esetben az állapot ellenőrzése elég. Na de mégis akkor miért használunk mockokat? Képzeljünk el egy void metódust, például egy aszinkron message publishert. Meg kell győződjünk róla, hogy az adott üzenet át lett adva neki. Létrehozhatnánk egy származtatott osztályt, amiben valamiféle számlálóval nézzük, hogy hányszor hívtuk azt meg (ami egy spy lenne), de ha a pontos átadott paramétereket kell vizsgálnunk, akkor kézenfekvő mockokat használni, hogy ellenőrízzük a hívást és a paramétereket.

```
```
class <strong class="markup--strong markup--pre-strong">MockOrder</strong> extends <strong class="markup--strong markup--pre-strong">Order</strong> {
  private boolean discountApplied = false;

  @Override
  void <strong class="markup--strong markup--pre-strong">applyDiscount</strong>(){
    discountApplied = true;
  }

  boolean <strong class="markup--strong markup--pre-strong">discountApplied</strong>(){
    return discountApplied;
  }

  void <strong class="markup--strong markup--pre-strong">verifyDiscount</strong>(){
    assertTrue(discountApplied());
  }

}
```
```

Fentebb látható az implementációja egy nagyon egyszerű mocknak (a neve egy kicsit félrevezető lehet, mert nem ellenőrzünk közvetlenül metódushívásokat). A tesztjeinkben átadhatjuk ezt a tesztelendő objektumnak és később pedig, meghívva a verify metódust ellenőrízhetjük, hogy a kupont felhasználtuk-e, megvizsgálva az objektum belső **állapotát**.

Na és el is értünk a kis kitérőnk végéhez: a **mockista** és **klasszicista** csoportokhoz. Az előbbi jobb szeret mockokat használni és viselkedést ellenőrízni, míg a másik az állapotot ellenőrzi inkább. Amikor létrehozol egy mockot a tesztedben és azt várod, hogy meghívjanak valamilyen metódust, akkor hozzákötöd ezt az implementációt a tesztedhez. Ennélfogva amikor bármi változik az implementációban, akkor nagyobb az esélye annak, hogy a tesztünk el fog törni, még akkor is, ha továbbra is elvégzi a dolgát, hiszen a belső állapota nem változott. Mindeközben az állapot ellenőrzéséhez újabb metódusokat kell használni, hogy ellenőrízni tudjuk azt. Fel kell tenned magadnak a kérdést: elég nekem, ha a végeredmény helyes, vagy jobban érdekel az, hogy is jutott el oda az adott metódus?

**Spy:** Kezdjük először az elméleti résszel, mert a különböző keretrendszerek másképp implementálják ezt.

Kiváncsiak vagyunk, hogy ez adott metódus meghívásra került, netán a paraméterekre, amiket a teszt során kapott. Ehhez létre tudunk hozni egy spy-t, aminek vannak úgynevezett 'vallató' metódusai. Ezen metódusoka segítségével tudjuk ellenőrízni, hogy az adott spy-t megfelelően használták. A spy olyan, mint egy mock, azzal a különbséggel, hogy nem fogja önmagát ellenőrzni.

```
```
class <strong class="markup--strong markup--pre-strong">SpyOrder</strong> extends <strong class="markup--strong markup--pre-strong">Order</strong> {
  private boolean discountApplied = false;

  @Override
  void <strong class="markup--strong markup--pre-strong">applyDiscout</strong>(){
    discountApplied = true;
  }

  boolean <strong class="markup--strong markup--pre-strong">discountApplied</strong>(){
    return discountApplied;
  }
}
```
```

A fenti példában majdnem ugyanazt az osztályt használjuk, mint a mockok esetében azzal a különbséggel, hogy hiányzik a verify metódus. Kézzel kell ellenőríznünk azt. Ha nem akarunk létrehozni több verify metódust az egyes elvárt állapotokra, akkor egy spy létrehozása a megfelelő döntés. A tesztünk során ezuán úgy variáljuk az egyes ellenőrzéseket, ahogy akarjuk.

> **Megjegyzés a spy-okról:** Egyes keretrendszerek (például a Mockito) a spy szót használja az objektumok köré húzott proxykra, amikkel stub és mock viselkedést is tudunk szimulálni.

**Fake:** ezeknél van bizonyos működő implementáció, de sokkal egyszerűbb és emiatt nem használható éles környezetben. Vannak tipikus példái, mint az in-memory adatbázisok, fake JSON API-k és még sorolhatnánk. A céljuk szimplán annyi, hogy a tesztek futását gyorsítsák.

```
```
class <strong class="markup--strong markup--pre-strong">FakeUserRepository</strong> implements <strong class="markup--strong markup--pre-strong">UserRepository</strong> {
  
  private HashMap<Long, User> map = new HashMap<>();

  void <strong class="markup--strong markup--pre-strong">add</strong>(User user){
    map.put(user.getId(), user);
  }

  boolean <strong class="markup--strong markup--pre-strong">findById</strong>(Long userId){
    return map.get(userId);
  }
}
```
```

Fentebb egy fake repository implementáció található, ami az adatot egy hashmapben tárolja egy valódi adatbázis helyett. Fontos megjegyezni, hogy az ilyen fake repository-k **nem alkalmasak integrációs tesztelésre****.**

Na de vissza az eredeti témára. Tehát mikor meghívjuk azt a bizonyos **createMock** metódust, akkor egy dummy-t fog kiköpni magából. Ha felkonfigurálod, hogy adjon vissza valamilyen adatot, akkor átváltozik stubbá. Tegyük fel, hogy ellenőrízni akarod a metódusokat, amiket meghívtak rajta: mostmár egy spy-od van. Ha az objektumon akarod ellenőrízni a fenti állapotot, akkor pedig mock lesz belőle. A fake az egy teljesen más történet és nem lehet létrehozni mockoló keretrendszerrel (vagy legalábbis nem tudok róla), hanem kézzel kell implementálnod.

Abban az esetben, ha minden egyes hívást ellenőrzöl a tesztjeidben (pont úgy, ahogy a képzeletbeli kollégánk javasolta), akkor csak mockokat fogsz létrehozni és ezáltal a tesztjeidet hozzákötöd az implementációhoz. Hosszútváon ez meg fogja nehezíteni az életed, amikor refaktorálásra kerül a sor, úgyhogy inkább ne tedd.

Remélem ez segített, hogy jobban megértsd mik és mire is valók azok a bizonyos teszt dublőrök.
