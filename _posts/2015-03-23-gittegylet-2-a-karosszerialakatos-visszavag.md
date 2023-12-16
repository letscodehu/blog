---
id: 428
title: 'Gittegylet 2 &#8211; A karosszérialakatos visszavág'
date: '2015-03-23T17:04:31+01:00'
author: tacsiazuma
layout: post
guid: '{{ site.url }}/?p=428'
permalink: /2015/03/23/gittegylet-2-a-karosszerialakatos-visszavag/
dsq_thread_id:
    - '3619867620'
    - '3619867620'
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
tags:
    - branch
    - commit
    - git
    - hook
    - pull
---

Az [előző részben]({{ site.url }}/2015/02/22/a-git-tegylet/ "A git (t)egylet") kitárgyaltunk egy pár parancsot, amik a git alapvető használatához szükségesek ![kaszni](assets/uploads/2015/03/kaszni-1024x768.jpg)(igen, a pull kimaradt, ezt mindjárt orvosoljuk) , ebben a részben kicsit mélyebben belemegyünk egyes parancsokba, a branchekről és tagekről is szó esik, valamint a következő részben mélyebben kitárgyaljuk a hook-okat.

#### Pull in...

A pull, ami az előző részből kimaradt, nevéből fakadóan a push ellentéte... azaz majdnem. A pull valójában két parancs kombinációja, ezek pedig a fetch és a merge. A lényeg, hogy egy másik repositoryból rántjuk be a tartalmat (fetch) és fűzzük össze (merge) a sajátunkkal. Az összefűzés, ha minden vágyunk teljesült, akkor mindenféle probléma nélkül lezajlik.  
Ha nem volt szerencsénk, akkor bizony elő kell kapjunk egy mergetoolt. A git clone-al ellentétben a pullhoz szükséges egy már létező git repository, mivel itt nem a teljes tartalmat fogjuk lekérni, hanem egy adott branch (alapesetben az a branch, ami éppen ki van checkoutolva az adott git repository-ban, ahová pullolni szeretnénk).

#### Fatörzs kifli[![fatörzs](assets/uploads/2015/03/fatörzs-682x1024.jpg)](assets/uploads/2015/03/fatörzs.jpg)

Amikor verziókezelésbe kezdünk, akkor alapesetben az úgynevezett master ágon tesszük azt. Ez a projektünk fő ága. Ha egyedül dolgozunk egy projekten, nincs ticketing rendszer, akkor lehet sosem fogjuk ezt az ágat elhagyni és talán nem is lesz rá szükségünk. Azonban akkor a verziókövetésnek az egyik legfontosabb funkcióját dobjuk sutba, ami pedig a különböző elágazások, ún. branch-ek kezelése.

> A verziókövetés első szabálya: Az van mentve, ami commit-olva van.
> 
> A verziókövetés második szabálya: Az van mentve, ami k\*\*\*\*\*a commit-olva van.

#### Only master

Ha az ember valami IDE-be kapcsolt git plugint használ, akkor az ide-oda kattintgatás és felfedezőút ![onlymaster](assets/uploads/2015/03/onlymaster.jpg)során bizonyára megtalálja a grafikus reprezentációját az adott repository-jának. Ha nem hozott létre új branch-eket, akkor az egy egyenese vonalat követ, ahol minden egyes commit 1-1 csomópont. A lenti ábrán megkíméltelek benneteket a commitokat azonosító hash-ektől. Ezek között a commit-ok között tudunk ide-oda ugrálni és kicheckoutolni az egyes revíziókat, végigjárhatjuk őket, megnézhetjük a differenciát az egyes fájlok külöböző verziói, commit-ok között.

#### Development branch

Tegyük fel, hogy némileg automatizáltuk a fejlesztés folyamatát. A munkahelyen van egy saját kis repository-nk, amin dolgozgatunk. Ezt csak mi látjuk bentről, de szeretnénk, ha lenne egy preview site is, ahol az ügyfél nyomon követhetné, hogy is állunk. A nap végi rutin az, hogy ide pusholunk egyet, ezzel hookokon keresztül frissítve a preview oldalt (netán automatizáltuk és git pullt hajt végre egy cron).

Igen ám, de mi a helyzet akkor, ha mi egy olyan commit-al nyugtáztuk a napot, ami a homepage-re kiokád egy nem is fém, nem is műanyag, hanem fatál error-t? A git pull nem tudja, hogy mi olyan kódot commit-oltunk, ami nem az igazi még, ennek megfelelően szó nélkül berántja azt, tehát ez ellen valahogy védekeznünk kellene. Erre (és rengeteg másra) valók a branch-ek. A verziókövetésnél nem árt, ha struktúráljuk azt, ahogy a kóddal is tennénk.[![master_dev](assets/uploads/2015/03/master_dev.jpg)](assets/uploads/2015/03/master_dev.jpg)

Ennek megfelelően létrehozunk egy ún. development ágat, amibe commit-olgatunk és amikor leteszteltük (vagy mások letesztelték) azt a dev szerveren, bemerge-ljük a master ágba és folytatjuk a development ágon a munkát. Így lefuthat a git pull, netán nyomhatjuk a push-t a master ágról, a lényeg: csak olyan kód fog kikerülni a preview szerverre, amit nem szégyellünk.  
Erre a development branchre tekinthetünk úgy, mint a mi kis játszóterünkre, ahol szabadon próbálgathatjuk a szárnyainkat, <span style="text-decoration: line-through;">tehetjük tönkre a hintát</span> and so on.

Ennél egy fokkal lépjünk tovább. Tegyük f[![dev_and_feature](assets/uploads/2015/03/dev_and_feature.jpg)](assets/uploads/2015/03/dev_and_feature.jpg)el, hogy az oldalunk már kész, de az ügyfél felkeresett, mert újabb igényei vannak. Ennek megfelelően létrehozunk egy development ágat ismét, de mivel most két embert is állítottak az ügyre, akik különböző feature-öket hivatottak lefejleszteni, a development branchből leágaztatjuk a saját kis feature águnkat és szép tatásan commitolgatunk bele. Ugyanezt teszi a másik srác is, aki szintén egy devből leágaztatott feature ágba szuttyogja a kódot. (Aztán majd bemergeli devbe és várja a hőn áhított pull-t,<del> ahol a conflictokat igényesen egy use mine-al oldjuk meg 😀</del>)

Még nem végeztünk a dologgal, amikor benyögi a Jira, hogy bizony egy igen <span style="text-decoration: line-through;">busás vérdíjat</span> sürgős bug ticketet tűztek ki a fejünkre. Mivel ez a bug a productionben is jelen lévő master (vagy production) ágon van, ezért mi becommitoljuk a változtatásainkat a feature ágba, utána checkoutoljuk a master ágat (azaz annak a legfrissebb verzióját). Aztán ebből leágaztatunk egy adott tickethez tartozó bugfix ágat és kijavítjuk a hibát, majd visszamergeljük a masterbe, ami aztán egy tesztelés után ki is kerülhet éles környezetbe.[![branches_all](assets/uploads/2015/03/branches_all.jpg)](assets/uploads/2015/03/branches_all.jpg)

Ezután visszaváltunk a feature águnkhoz és folytatjuk rajta a munkát. Ha kész, akkor bemergeljük a development branchbe. Aztán ha a kolléga is kész,akkor bepulloljuk az ő feature ágját is. Itt ha conflict van még mindig könyebb megoldani, mint a masteren. Ha megoldottuk őket, akkor leteszteljük a dolgot és ha nem halt le, akkor bemergeljük a masterbe. És ezzel újra egy águnk maradt.

Persze ezt vihetjük tovább is, létrehozhatunk mindenféle ágakat és kényünk/kedvünk szerint alakíthatjuk azt.

#### HEAD, detached HEAD

Az előző fejezetben szó volt arról, hogy az egyes commitok hash-ét használva tudunk ide-oda ugrálni köztük és checkoutolni azt. Hogy ne kelljen egy sticky note-ra felírkálni az egyes commit-ok hash-ét és úgy azonosítani azokat, a git biztosít számunkra több fájlt, amiben az egyes commitokra mutató referenciák vannak. Ezeket a .git/refs mappában találjuk. Az egyes branch-ek is igazából csak ilyen referenciák, szóval pusztán logikailag léteznek. Ezek szimpla szöveges fájlok, így belenézhetünk a tartalmukba, de nem ajánlatos kézzel beleírogatni, így inkább próbáljuk ki a következő parancsot:

```
git update-ref refs/heads/master 2342efe424ad4349d9f5ea
```

Ezzel a master ágon létrehoztunk egy adott SHA-1 értékre (commitra) mutató referenciát. Lényegében a refs/heads/master fájl tartalma az az egy hash lesz, amit itt beállítottunk. Amikor nyomunk egy git branch akármicsoda parancsot, akkor a git igazából egy update-refet fog végrehajtani és az aktuális branch legutóbbi commit-jának SHA-1 értékét fogja beállítani.

> Na de honnan tudja a git, hogy én éppen "hol állok?"

Erre való az ún. HEAD file. Ha mi éppen a master ágon állunk, akkor ez a fájl a következőt tartalmazza:

```
ref: refs/heads/master
```

Akkor most mivan? A lényeg az, hogy a HEAD fájl egy referencia egy másik referenciára, mégpedig arra a branch-re, amin éppen állunk. Ha beírjuk a következőt:

```
git checkout test
```

Akkor a fájl tartalma az alábbiak szerint módosul:

```
ref : refs/heads/test
```

<figure aria-describedby="caption-attachment-450" class="wp-caption aligncenter" id="attachment_450" style="width: 584px">[![refs](assets/uploads/2015/03/refs.jpg)](assets/uploads/2015/03/refs.jpg)<figcaption class="wp-caption-text" id="caption-attachment-450">Egy egyszerű branch-elés logikai felépítése</figcaption></figure>

Tehát mostantól a HEAD fájl a test branch utolsó commitjára (head-jére) mutat. Ugye a commit-ok egy láncot (linked list) alkotnak, aminek az első elemét valahogy be is kellene tudni azonosítani. Ez az adott branch head-je, ami a refs/heads/<branchnév> fájlban található. Az egész pointerek hálózata, ahol a pointerek legvégül egy-egy commit-ra mutatnak. Az alábbi fájlon jól látható, hogy a commit-ok ugye egy-egy SHA-1 hashel vannak jelölve. A legutolsó elemre mutat az adott branch head-je, a HEAD fájl pedig a jelenleg checkoutolt master head-re mutat. A fenti ábra emberi elme és szem számára könnyebben értelmezhető reprezentációja látható lentebb. Ugye itt látható, hogy a HEAD fájl a master head-re mutat, tehát az van checkoutolva és látható a development ág is, annak az utolsó commitjával együtt.

[![refs_visual](assets/uploads/2015/03/refs_visual.jpg)](assets/uploads/2015/03/refs_visual.jpg)

Ha nagyon belelendülünk az ide-oda branch-elésbe, óhatatlan, hogy belefussunk abba, hogy az IDE, netán a terminál benyögi, hogy mi bizony egy ún. detached HEAD state-be kerültünk. Nem kellemes, ha az embert megfosztják a fejétől, így Linus Torvald se szeretné ezt. A fenti ábrán ugye megbeszéltük, hogy a HEAD referencia egy másik referenciára (branch-re). Viszont tegyük fel, hogy mi visszatérünk egy régebbi commithoz a master ágon. Checkoutoljuk a fenti ábrán szereplő első commit-ot. Ekkor a HEAD fájl már nem a refs/heads/master-re fog mutatni, hanem direkt a commit-ra. ![headless-horseman-chris-beatrice](assets/uploads/2015/03/headless-horseman-chris-beatrice.png)Ezt nevezik detached HEAD-nek. Ha itt commitolunk egyet, az egy külön ágra fog kerülni, ami jelenleg nem tartozik egyetlen branchez sem, mivel nem mutat rá a refs/heads/ könyvtárban található egyetlen fájl sem. Emiatt, ha mi ebből az állapotból visszatérünk egy másik ágra, akkor a módosításaink elvesznek. A commit-ok ott lesznek majd, de a git nem tudja őket sehova se tenni, mert nem hoztunk létre referenciát. Ezért kell egy referenciát létrehoznunk a git branch, git tag vagy git checkout -b parancsok valamelyikével.

#### Tags

Ugye azt beszéltük, hogy az ágak azok igazából egy-egy vonalat fognak jelölni a fejlesztés életciklusában, a commit-ok pedig egy-egy pontot. Azonban elég nehéz egy-egy pontot azonosítani egy szolid sha-1 hashből és bizonyára eljön az idő, mikor egy adott commit-ot szeretnénk kiemelni a többiek közül. Ezt tag-ekkel tudjuk elérni. Ilyen módon tudunk ún. mérföldköveket létrehozni a fejlesztésünk történetében, főverziókat jelölni és hasonlók.

<figure aria-describedby="caption-attachment-444" class="wp-caption aligncenter" id="attachment_444" style="width: 510px">![galup_tag41](assets/uploads/2015/03/galup_tag41.jpg)<figcaption class="wp-caption-text" id="caption-attachment-444">Itt elég sok fájl mutat a refs/tags mappában ugyanarra a SHA-1 hash-re.</figcaption></figure>

A tag-ek hasonlóképpen működnek, mint a már említett referenciák, egy adott commit-ra fognak mutatni.

```
git tag -a <tag_neve> <commit_hash> <tag_annotation>
```

Sajnos a hooks-ra, mergetool-okra nem maradt időm, de majd legközelebb ígérem pótlom a hiányosságokat!