---
id: 856
title: 'Back (up) me baby one more time!'
date: '2015-12-19T22:08:46+01:00'
author: tacsiazuma
layout: post
guid: '{{ site.url }}/?p=856'
permalink: /2015/12/19/back-up-me-baby-one-more-time/
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
dsq_thread_id:
    - '4418125725'
    - '4418125725'
newsphere-meta-content-alignment:
    - align-content-left
image: 'assets/uploads/2015/12/09201944/melted-hard-disk-drive.jpg'
categories:
    - Backend
tags:
    - amanda
    - backup
    - concurrency
    - dump
    - innodb
    - lock
    - myisam
    - mysql
    - transaction
---

Akárki akármit mondd, biztonsági mentéseket csinálni fontos.

[Előző ]({{ site.url }}/2015/12/17/scooter-back-it-up/)cikkemben átvettünk pár dolgot a mentések mibenlétét illetően és elindultunk a legegyszerűbb módszerektől, amit most folytatnánk az egyik konkrét célszoftverrel.[![melted-hard-disk-drive](assets/uploads/2015/12/melted-hard-disk-drive.jpg)](assets/uploads/2015/12/melted-hard-disk-drive.jpg)

> **Update:** Mivel az előző cikkben nem tértem ki arra, hogy a dump esetében mi a helyzet az inkonzisztens adatokkal, ezért most a drágalátos Amanda előtt erről ejtenék szót.

Az előző részben Pistike épp ott tartott, hogy minden éjfélben csinált egy dumpot az egyes adatbázisokról, amivel nincs is probléma akkor, ha a dump időpontjában nem zajlik épp valami írás a táblákba.

Ellenben ha ilyenről van szó, akkor ez attól függően, hogy az adott táblák tranzakcionálisak vagy sem produkálhat érdekes tüneteket.

#### Tranzakció

Adatbázisok esetében akkor beszélünk tranzakciókról, mikor összefogunk egy sor parancsot és egyetlen elemként (parancsként) kezeljük azt. Tegyük fel, hogy a felhasználói adatokat adatbázisban tárolod. Mikor azokat megváltoztatja, egy sor UPDATE paranccsal teszi azt, viszont itt ezeket egy tranzakcióként kezeljük.

Ezeknek jelentősége akkor van, mikor valami hiba következik be az egyes UPDATE parancsok során, akkor az egész tranzakció visszavonható. A másik nagy előnye, hogy mivel egy tranzakciót egy műveletként kezel, ezért a többi konkurrens lekérdezés nem fogja megváltoztatni az adatokat, amikkel mi éppen dolgozunk, hanem azok megvárják, míg ez a művelet véget ér. De nézzünk rá egy példát!

Tegyük fel, hogy 4 táblában végzünk INSERT-et egy felhasználó regisztrációja során. Legyenek ezek a users, user\_roles, user\_settings, user\_groups.

```
# ez az alapfelállás
INSERT INTO users ...;
INSERT INTO user_roles ...;
INSERT INTO user_settings ...;
INSERT INTO user_groups ...;
```

A fenti példában jól látható, hogy 4 külön parancsot hajtunk végre, amik végrehajtása sorban történik. Viszont mi a helyzet akkor, ha közben egy másik felhasználó is beregisztrál? Ugyanezeket a parancsokat hajtja ő is végre. Ha szerencsénk van, akkor a mi beillesztéseink már lezajlottak, ha nem.. akkor lehet gubanc az egyes kulcsokkal.

```
# ez az alapfelállás
INSERT INTO users ...; # 1
INSERT INTO users ...; # 2
INSERT INTO user_roles ...; # 1
INSERT INTO user_roles ...; # 2
INSERT INTO user_settings ...; # 1
INSERT INTO user_settings ...; # 2
INSERT INTO user_groups ...; # 1
INSERT INTO user_groups ...; # 2
```

Itt már látszik, hogy 8 külön parancsot hajtunk végre, viszont azok szépen egymás közé fűzve, hol az egyik regisztrációnál, hol a másiknál. Hogy itt ne legyünk bajban a last insert ID-kkal és hasonlókkal, ezeket a tranzakciókba fogjuk csomagolni:

```
# a start és a commit közti parancsokat összefogjuk és a mysql 1 parancsnak veszi azt.
START TRANSACTION;
INSERT INTO users ...;
INSERT INTO user_roles ...;
INSERT INTO user_settings ...;
INSERT INTO user_groups ...;
COMMIT;

# ennélfogva mysql szempontjából két parancsunk lesz
# transaction - az első user regisztráció
# transaction - a második user regisztráció
```

Viszont ez a cikk nem a tranzakciókról, commitokról és rollback-ekről szól, hanem a dumpokról, de ha erre van igény, tessék jelezni 😀

Szóval ott jártunk, hogy corrupted adatokat sikerült pistikének lementenie és ez ellen szeretne tenni valamit. Erre az egyik opció, hogy arra a rövid időre, amíg dumpol, maintenance módba helyezi az oldalt, dumpol, aztán visszakapcsolja. A laravelben az artisan CLI-jében van is erre parancs:

```
```php
php artisan down
```
```

és visszakapcsolni:

```
```php
php artisan up
```
```

Hasonló parancsok előfordulnak wordpressben, stb. Ellenben ne kanyarodjunk el a tranzakcióktól és tábláktól.

Ha egy tábla innoDB, akkor az natívan kezeli a tranzakciókat, a MyISAM ellenben nem. Nézzük hát meg a parancssori kapcsolókat:

```
--lock-all-tables
```

Ez a kapcsoló akkor szükséges, ha az alkalmazásunk több táblán is dolgozik egyszerre és azok közül kettő is MyISAM, szükségünk lesz erre a dump során.

```
--lock-tables
```

Ha ezt választjuk, akkor a dump során a mysql lockol egy adott táblát, kidumpolja, unlockolja, majd megy tovább. Ha MyISAM tábláink vannak, akkor szükségünk lesz rá.

```
--single-transaction
```

Ez a legkevésbé fájó módja hogy kidumpoljuk az adatainkat. Viszont csak akkor működik, ha minden táblánk InnoDB. Ha van MyISAM táblánk, akkor sem fog hibát dobni, viszont a backupunk inkonzisztens adatokat is tartalmazhat.

Tehát pistike immáron elérte, hogy konzisztens adathalmazt kapjon meg, minden éjfélkor. Viszont jelenleg csak az SQL-ben tárolt adatokkal kezdtünk valamit. Mi lenne, ha a fájlokat is lementenénk?

Az egyik erre a célra kitalált és legfapadosabb tool az **rsync** lesz, amire elég sok más programot építettek (syncrify, stb.)

[![byebyebye](assets/uploads/2015/12/byebyebye.gif)](assets/uploads/2015/12/byebyebye.gif)

A linux rendszereken általában megtalálható az rsync, ha nem, akkor az rsync.samba.org-ról letölthető. Ez a kis program hatékony fájlmozgatásra ad lehetőséget a hálózaton keresztül, de egy gépen belül is használható.

Nézzük az alapokat!

Tegyük fel, hogy szeretnénk a /var/www mappát lementeni a /var/backups/www mappába:

```
rsync -a /var/www/ /var/backups/www/ # a source esetében figyeljünk a végző /-ekre könyvtárak esetében!
```

Ha ezt beírjuk, látszólag nem történik semmi, de a -v (verbose) flaggel máris láthatjuk, hogy mit is csináltunk. Ez a parancs alapesetben ekvivalens a

```
cp -a /var/www/. /var/backups/www/
```

parancssal, azzal a különbséggel, hogy sokkal hatékonyabb, ha a fájlokban kevés differencia van, ugyanis itt nem kerül a teljes fájl átmásolásra, csupán azon belül a diffek közlekednek, a --compress flagre ráadásul tömörítve.

Nézzünk egy esetetet ssh protokollon át:

```
rsync -a -e ssh /var/www/ felhasznalonev@celgep.tld:/var/backups/felhasznalonev/www/
```

> Ha nem a 22-es porton át akarunk SSH-t, akkor az -e "ssh -p $port" -al csináljuk. Ügyeljünk, hogy mindkét rendszeren fent legyen az rsync program.

**Mi a helyzet a fájlokkal, amiket töröltünk?**

Vegyük a következő esetet. Egy fájl létezett a /var/www/-ben és a /var/backups/www-ben is. Majd töröltük a /var/www alól és szeretnénk, ha a célhelyről is törlődne. Erre a célra szolgál a --delete flag.

```
rsync -a --delete -e ssh /var/www/ felhasznalonev@celgep.tld:/var/backups/felhasznalonev/www/
```

> Persze ez feltételezi, hogy az SSH kulcsok által tudunk autentikálni

Mindezt megtehetjük fordítva, hogy a backup szerverünkön futtatjuk mindezt:

```
rsync -a --delete -e "ssh -p 2222" felhasznalonev@backupolandogep.tld:/var/www/ /var/backups/felhasznalonev/www/
```

Hirtelen ennyit, legközelebb az amandával vagy a baculával folytatom!
