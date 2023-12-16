---
id: 1994
title: '„Nem kívánatos” alkalmazások üzemeltetése Linuxon'
date: '2016-06-20T06:14:47+02:00'
author: janoszen
layout: post
guid: 'https://www.refaktor.hu/?p=1267'
permalink: /2016/06/20/nem-kivanatos-alkalmazasok-uzemeltetese-linuxon/
dublin_core_author:
    - 'Enter author here'
dublin_core_title:
    - 'Enter title here'
dublin_core_publisher:
    - 'Enter publisher here'
dublin_core_rights:
    - 'Enter rights here'
pyre_show_first_featured_image:
    - 'yes'
pyre_portfolio_width_100:
    - default
pyre_video:
    - ''
pyre_fimg_width:
    - ''
pyre_fimg_height:
    - ''
pyre_image_rollover_icons:
    - default
pyre_link_icon_url:
    - ''
pyre_post_links_target:
    - 'no'
pyre_related_posts:
    - default
pyre_share_box:
    - default
pyre_post_pagination:
    - default
pyre_author_info:
    - default
pyre_post_meta:
    - default
pyre_post_comments:
    - default
pyre_main_top_padding:
    - ''
pyre_main_bottom_padding:
    - ''
pyre_hundredp_padding:
    - ''
pyre_slider_position:
    - default
pyre_slider_type:
    - 'no'
pyre_slider:
    - '0'
pyre_wooslider:
    - '0'
pyre_revslider:
    - '0'
pyre_elasticslider:
    - '0'
pyre_fallback:
    - ''
pyre_avada_rev_styles:
    - default
pyre_display_header:
    - 'yes'
pyre_header_100_width:
    - default
pyre_header_bg:
    - ''
pyre_header_bg_color:
    - ''
pyre_header_bg_opacity:
    - ''
pyre_header_bg_full:
    - 'no'
pyre_header_bg_repeat:
    - repeat
pyre_displayed_menu:
    - default
pyre_display_footer:
    - default
pyre_display_copyright:
    - default
pyre_footer_100_width:
    - default
pyre_sidebar_position:
    - default
pyre_sidebar_bg_color:
    - ''
pyre_page_bg_layout:
    - default
pyre_page_bg:
    - ''
pyre_page_bg_color:
    - ''
pyre_page_bg_full:
    - 'no'
pyre_page_bg_repeat:
    - repeat
pyre_wide_page_bg:
    - ''
pyre_wide_page_bg_color:
    - ''
pyre_wide_page_bg_full:
    - 'no'
pyre_wide_page_bg_repeat:
    - repeat
pyre_page_title:
    - default
pyre_page_title_text:
    - default
pyre_page_title_text_alignment:
    - default
pyre_page_title_100_width:
    - default
pyre_page_title_custom_text:
    - ''
pyre_page_title_text_size:
    - ''
pyre_page_title_custom_subheader:
    - ''
pyre_page_title_custom_subheader_text_size:
    - ''
pyre_page_title_font_color:
    - ''
pyre_page_title_height:
    - ''
pyre_page_title_mobile_height:
    - ''
pyre_page_title_bar_bg:
    - ''
pyre_page_title_bar_bg_retina:
    - ''
pyre_page_title_bar_bg_color:
    - ''
pyre_page_title_bar_borders_color:
    - ''
pyre_page_title_bar_bg_full:
    - default
pyre_page_title_bg_parallax:
    - default
pyre_page_title_breadcrumbs_search_bar:
    - default
fusion_builder_status:
    - inactive
refaktor_post_views_count:
    - '4824'
avada_post_views_count:
    - '4825'
sbg_selected_sidebar:
    - 'a:1:{i:0;s:1:"0";}'
sbg_selected_sidebar_replacement:
    - 'a:1:{i:0;s:12:"Blog Sidebar";}'
sbg_selected_sidebar_2:
    - 'a:1:{i:0;s:1:"0";}'
sbg_selected_sidebar_2_replacement:
    - 'a:1:{i:0;s:0:"";}'
image: 'assets/uploads/2016/06/29123126/38343646_m_cropped.png'
categories:
    - Üzemeltetés
---

Időnként sajnos elkerülhetetlen, hogy olyan alkalmazásokat üzemeltessünk, amiket legszívesebben bottal sem piszkálnánk meg. Kinek a WordPress, kinek a Joomla, de szeretnénk minél jobban bezárni, gondoskodni arról, hogy egy biztonsági rés hatásai vagy egy vírus ne terjedjen át más rendszerekre. Nézzük meg, hogy ezt Linuxon hogyan valósíthatjuk meg.

> **Nehéz cikk!**  
> Ez a cikk nehéz olvasmány, szánj rá kellő időt!

## A filerendszer

Ideális esetben a bottal sem piszkálható alkalmazás egy olyan virtuális vagy fizikai gépen fut, amin semmi más nincs. A gond az, hogy egy ügyes támadó még egy viszonylag üres gépről is rengeteg információt szerezhet arról, hogy hogyan építjük fel az infrastruktúránkat, amit aztán felhasználhat más szolgáltatások elleni támadásokhoz.

Éppen ezért számunkra az lenne az ideális, ha a az alkalmazás a rendes filerendszer helyett csak egy tökéletesen üres, vagy maximum a számára feltétlenül szükséges fájlokkal megtöltött filerendszert látna az igazi helyett.

### A chroot

Mint kiderül, a Linux kernel erre nyújt lehetőséget. A `chroot` rendszerhívást ugyan eredetileg nem erre találták ki, de igen könnyen használható erre. Na de mit is csinál a chroot?

Windowson a különböző fájlrendszereket alapértelmezetten különböző meghajtónévvel látjuk, például `C:`, `D:`, stb. Ettől ugyan el lehet térni, de nem szokás. Linuxon ezzel ellentétben az összes filerendszert egy nagy fastruktúrában látjuk, kezdve a gyökér könyvtárral, a `/`-el. Ha például egy CD meghajtót szeretnénk felcsatolni (mountolni), azt egy alkönyvtárban tesszük, például `/mnt/cdrom`.

Amit kevesen tudnak: a Linuxban a gyökér könyvtár nem más, mint egy mutató, amit meg lehet változtatni. Magyarán lehetőségem van arra, hogy egy mappa mostantól az új gyökér könyvtár legyen. Ezt csinálja a `chroot` parancs. Hogyan működik ez? Nézzük meg egy kis C példakóddal. (Ne ijedj meg, nem lesz bonyolult.)

```
chdir("/mnt/mychroot");
if (chroot("/mnt/mychroot") != 0) {
    perror("chroot /mnt/mychroot");
    return 1;
}
chdir("/");
```

Hogy ennek legyen is valami gyakorlati értelme, futtassuk le, és irassuk ki az aktuális könyvtár tartalmát:

```
#include <stdio.h>
#include <unistd.h>
#include <dirent.h>

int main(void) {
    chdir("/mnt/mychroot");
    if (chroot("/mnt/mychroot") != 0) {
        perror("chroot /mnt/mychroot");
        return 1;
    }
    chdir("/");

    /* Kiolvassuk az aktualis konyvtarat */
    DIR *dir;
    struct dirent *ent;
    if ((dir = opendir (".")) != NULL) {
        while ((ent = readdir (dir)) != NULL) {
            printf ("%s\n", ent->d_name);
        }
        closedir (dir);
    } else {
        perror ("");
        return 2;
    }
    return 0;
}
```

Ezt (root userrel) lefuttatva egy teljesen üres könyvtárat fogunk látni, vagyis az elvárt eredményt produkálja. Ha figyelmesen olvasol, egy dolog viszont feltűnhet: miért kell könyvtárat váltanunk a `chroot()` előtt és után?

Ha kivesszük a könyvtár váltást, azt tapasztalhatjuk, hogy a chroot ellenére továbbra is az eredeti könyvtárat látjuk!

```
$ ./a.out
.
..
a.out
chroot.c
mychroot
```

Ha utánanézünk kicsit jobban, rájövünk, hogy ez miért van így: annak ellenére, hogy a root könyvtár megváltozott, az aktuális könyvtár továbbra is az eredeti, ahonnan elindítottuk a programot. Ez rávilágít a chroot() egyik alapvető problémájára: ha az indító program megtart valamilyen hivatkozásokat, nyitott fájlokat a chroot előttről, azok mentén lehetősége nyílhat kitörni a chrootból, még akkor is, ha nem rootként fut a program.

Szerencsére a jobban megírt chroot implementációk, például a parancssori chroot parancs, vagy a PHP-FPM-be beépített chroot funkció ezekről gondoskodnak, de ha saját magát chrootolni képes programot futtatunk, erre érdemes oda figyelni.

> **Tipp!**  
> A `chroot()` a BSD Unixokból származik, így többek között MacOS X-en is elérhető.

> **Figyelem!**  
> Rendszergazda (root) joggal bármikor ki lehet törni egy `chroot`-olt környezetből! Az alkalmazásaid lehetőleg soha ne használjanak root usert!

Egy dologról még nem beszéltünk: mi a teendő akkor, ha a chrootban futtatandó alkalmazásnak szüksége van bizonyos fájlokra? Ha strace-szel elemezzük például egy PHP-FPM futását a `chroot()` után, jó néhány fájlt be fog olvasni a chrooton belülről. ([A strace-ről ebben a cikkünkben írtunk részletesen.](/low-level-debugolas-1-resz-strace/))

```
[pid 15055] open("/usr/share/zoneinfo/", O_RDONLY|O_NONBLOCK|O_DIRECTORY|O_CLOEXEC) = 6
[pid 15055] stat("/usr/share/zoneinfo//localtime", {st_mode=S_IFREG|0644, st_size=3545, ...}) = 0
[pid 15055] stat("/usr/share/zoneinfo//leap-seconds.list", {st_mode=S_IFREG|0644, st_size=10384, ...}) = 0
[pid 15055] stat("/usr/share/zoneinfo//Zulu", {st_mode=S_IFREG|0644, st_size=127, ...}) = 0
...
[pid 15055] open("/usr/share/zoneinfo/zone.tab", O_RDONLY) = 6
...
```

Ha ezeket a fájlokat nem bocsájtjuk rendelkezésre a chrooton belül, a PHP dátumkezelése például nem fog helyesen működni. Éppen ezért ezt muszáj megtenni:

```
rsync -avz --delete /usr/share/zoneinfo/ /mnt/mychroot/usr/share/zoneinfo/
```

Ha nem szeretnénk bemásolni a fájlokat, csak tükrözni, használhatjuk a bind mount funkciót is, így nem foglalja a helyet a merevlemezen:

```
mount -o bind /usr/share/zoneinfo/ /mnt/mychroot/usr/share/zoneinfo/
```

> Figyelem!  
> A bind mount nem permanens, minden gép induláskor végre kell hajtani! Ezt egy bejegyzéssel az /etc/fstab fájlban megoldhatjuk, azonban sok bind mount számottevően lassíthatja egy gép indulását!

Ezek eddig statikus fájlok. Ha futtatható programokat is szeretnénk bent tartani, kicsit bonyolultabb a helyzet. A futtatható programok futtatásához legtöbbször szükség van különböző külső függvénykönyvtárakra. Ezeket az `ldd` paranccsal fedezhetjük fel:

```
$ ldd /usr/bin/php
	linux-vdso.so.1 =>  (0x00007ffcd6b7d000)
	libresolv.so.2 => /lib/x86_64-linux-gnu/libresolv.so.2 (0x00007f35ee4a9000)
	libz.so.1 => /lib/x86_64-linux-gnu/libz.so.1 (0x00007f35ee28f000)
...
```

Ezeknek a függvénykönyvtáraknak természetesen további függőségei lehetnek, amiknek szintén lehetnek függőségei, stb. stb. éppen ezért a chroot építésre érdemes olyan szoftvereket használni, amik ezt automatikusan megoldják. Az egyik ilyen szoftver például a [jailkit](http://olivier.sessink.nl/jailkit/).

### Filerendszer korlátozások

Amellett, hogy természetesen állíthatunk be jogosultságokat, van néhány érdekes mount opció, amivel korlátozhatjuk a kérdéses alkalmazásunkat.

<dl><dt>ro</dt><dd>Írásvédetté teszi az adott könyvtárat.</dd><dt>nosuid</dt><dd>Alapértelmezetten Linuxon lehetőség van a végrehajtható programokon egy un. Set UID bit beállítására. Ez azt eredményezi, hogy a program nem a programot indító felhasználó nevében fut, hanem a fájl tulajdonosa alatt. Ezt használja például a `sudo` parancs arra, hogy felhasználót váltson. A `nosuid` opció azt eredményezi, hogy a rendszer figyelmen kívül hagyja a set UID bitet.</dd><dt>noexec</dt><dd>A noexec bit azt eredményezi, hogy az adott meghajtón levő fájlok nem hajthatóak végre. Ne felejtsük el, hogy ez csak a binárisokat érinti, ha egy scriptnyelven (pl. bash, PHP, stb) írunk programokat, és az adott scriptnyelv végrehajtó programja elérhető, ezek továbbra is működnek. (Tehát a `./script.py` parancs nem fog működni, a `python ./script.py` viszont igen.)</dd><dt>nodev</dt><dd>Nem engedélyezi a device-jellegű fájlrendszer bejegyzéseket. Ez azt akadályozza meg, hogy a korlátozott folyamat vagy felhasználó rendszereszközökhöz férjen hozzá. (Ezzel óvatosan, szinte minden programnak szüksége van a `/dev/null`, `/dev/urandom`, stb. fájlokra.)</dd></dl>Ahhoz, hogy ezeket az opciókat használni tudjuk, vagy az egész meghajtóra beállíthatjuk ezeket, vagy a fent mutatott `bind mount` módszerrel korlátozhatunk csak egy könyvtárat.

## Tűzfalazás

Linuxban a tűzfal (netfilter) úgy működik, hogy a rendszerből kiinduló, beérkező vagy áthaladó adatcsomagok egy láncokba szervezett szűrőn haladnak keresztül. Az `iptables` (vagy IPv6 esetén `iptables6`) paranccsal módosíthatjuk a láncok tartalmát. Ha például szeretnénk beengedni a 80-as porton a forgalmat, ezt így tehetjük meg:

```
iptables -A INPUT -p tcp --dport 80 -j ACCEPT
iptables -A OUTPUT -p tcp --sport 80 -j ACCEPT
```

Az iptables / netfilter tárgyalása egy önálló cikket igényelne, így ezt részleteiben itt nem tárgyaljuk, de nézzünk meg egy kevesek által ismert funkciót, ami különösen hasznos különböző alkalmazásók korlátozására.

Ha a csomag a helyi gépről származik, a Linuxos tűzfal meg tudja állapítani, melyik felhasználó, és melyik folyamat küldte azt ki. Ezt felhasználva akár egyetlen felhasználót is korlátozhatjuk.

Ha például a `webusers` csoport valamennyi felhasználóját meg akarjuk akadályozni a hálózat elérésében, ezt kell tennünk:

```
iptables -A OUTPUT -m owner --gid-owner webusers -j REJECT
```

Egy teljes tűzfal nézhetne ki például így:

```
#!/bin/bash

iptables -F
iptables -X
iptables -t nat -F
iptables -t nat -X
iptables -t mangle -F
iptables -t mangle -X
iptables -P INPUT ACCEPT
iptables -P FORWARD ACCEPT
iptables -P OUTPUT ACCEPT

iptables -A OUTPUT -m owner --gid-owner webusers -p tcp -d 127.0.0.1 --dport 3306 -j ACCEPT
iptables -A OUTPUT -m owner --gid-owner webusers -p tcp --dport 80 -j ACCEPT
iptables -A OUTPUT -m owner --gid-owner webusers -p tcp --dport 443 -j ACCEPT
iptables -A OUTPUT -m owner --gid-owner webusers -j REJECT
```

Mint látható, a nevezett csoport elérheti a helyi gépen futó MySQL szervert, és bármilyen webszerverre küldhet kérést.

> Vigyázat!  
> A `--gid-owner` csak és kizárólag a folyamat csoportjára vonatkozik, nem a futtató felhasználó kiegészítő csoportjaira! Vagyis egyszerűbben szólva, a szabály alapértelmezetten a felhasználó fő csoportjára vonatkozik.

## Capabilityk

Eredetileg Linuxon rengeteg olyan dolog volt, amire kizárólag a root usernek volt joga. Ilyen volt az 1024 alatti portok nyitása, vagy a raw socketek nyitása. Emiatt rengeteg program kizárólag root alatt futhatott, vagy rootként kellett indítani és maga a program váltott át a számára kijelölt felhasználóra.

A capabilityk éppen ezt a problémát próbálják megoldani. Ezekkel lehetőségünk van bizonyos, egyébként root alatt használható képességeket megtartani egy másik userre váltva, vagy egy rootként futó programtól bizonyos jogokat elvenni. A teljes listát a `man capabilities` parancs alatt találjuk, de nézzünk néhány példát:

|  | <th>`CAP_CHOWN`</th> |  | Tetszőleges fájl tulajdonosának a megváltoztatása. |  |
|---|----------------------|---|---------------------------------------------------------|---|
|  | <th>`CAP_KILL`</th> |  | Signal (pl. `SIG_KILL`) küldése tetszőleges folyamatnak. Nem root felhasználó alapértelmezetten csak az azonos felhasználó alatt futó folyamatoknak küldhet signalt. |  |
|  | <th>`CAP_NET_ADMIN`</th> |  | Hálózati interfacek konfigurálása, tűzfal kezelés, routing táblák módosítása, hálózati forgalom figyelése, stb. |  |
|  | <th>`CAP_NET_RAW`</th> |  | A TCP/UDP megkerülése, tetszőleges csomag küldése. |  |
|  | <th>`CAP_NET_BIND_SERVICE`</th> |  | Szolgáltatás indítása 1024 alatti portokon. |  |
|  | <th>`CAP_SETUID` és `CAP_SETGID`</th> |  | A folyamatot futtató felhasználó / csoport váltása. |  |
|  | <th>`CAP_SYS_CHROOT`</th> |  | A root filerendszer megváltoztatása az adott folyamatra. |  |
|  | <th>`CAP_SYS_NICE`</th> |  | Az aktuális folyamat prioritásának megváltoztatása. |  |

Mint minden mást, C-ből megírhatjuk a kényes programot futtató kódot, de természetesen parancssoros eszközök is léteznek erre a feladatra. A `capsh` program például capabilityk mellett felhasználó váltásra és chrootlásra is képes az átadott program futtatása előtt.

```
sudo capsh --keep=1 --user=janoszen --caps=cap_net_raw+epi -- -c "/bin/ping www.google.com"
```

Ha a ping futtatása közben lefuttatjuk a `ps auwfx` parancsot, látható, hogy a `ping` parancs a saját felhasználóm alatt fut, noha elvileg root jogokra lenne szüksége.

## Erőforrások korlátozása

A cikk témáját képező, bottal nem megpiszkálandó alkalmazások sokszor nem csak biztonsági szempontból aggályosak, hanem erőforrások szempontjából is kényesek. Az eredeti Linuxos erőforrás limitek (ulimits) nem túl hasznosak, mivel a korlátok folyamatonként kerülnek alkalmazásra, azaz a kérdéses alkalmazás rengeteg folyamat (process vagy thread) indításával meg tudja kerülni ezeket. A cgroupok ezzel szemben csoportokba foglalják a folyamatokat, és az erőforrás korlátokat ezekre alkalmazzák.

Ha például egy aktuális Ubuntu verzión végrehajtjuk a `mount` parancsot, ezeket látjuk:

```
cgroup on /sys/fs/cgroup/systemd type cgroup (rw,nosuid,nodev,noexec,relatime,xattr,release_agent=/lib/systemd/systemd-cgroups-agent,name=systemd,nsroot=/)
cgroup on /sys/fs/cgroup/blkio type cgroup (rw,nosuid,nodev,noexec,relatime,blkio,nsroot=/)
cgroup on /sys/fs/cgroup/net_cls,net_prio type cgroup (rw,nosuid,nodev,noexec,relatime,net_cls,net_prio,nsroot=/)
cgroup on /sys/fs/cgroup/cpuset type cgroup (rw,nosuid,nodev,noexec,relatime,cpuset,nsroot=/)
cgroup on /sys/fs/cgroup/pids type cgroup (rw,nosuid,nodev,noexec,relatime,pids,nsroot=/)
cgroup on /sys/fs/cgroup/freezer type cgroup (rw,nosuid,nodev,noexec,relatime,freezer,nsroot=/)
cgroup on /sys/fs/cgroup/cpu,cpuacct type cgroup (rw,nosuid,nodev,noexec,relatime,cpu,cpuacct,nsroot=/)
cgroup on /sys/fs/cgroup/hugetlb type cgroup (rw,nosuid,nodev,noexec,relatime,hugetlb,nsroot=/)
cgroup on /sys/fs/cgroup/memory type cgroup (rw,nosuid,nodev,noexec,relatime,memory,nsroot=/)
cgroup on /sys/fs/cgroup/perf_event type cgroup (rw,nosuid,nodev,noexec,relatime,perf_event,nsroot=/)
cgroup on /sys/fs/cgroup/devices type cgroup (rw,nosuid,nodev,noexec,relatime,devices,nsroot=/)
```

Azaz a `/sys/fs/cgroup` könyvtárban találunk olyan virtuális fájlokat, amikkel befolyásolhatjuk az adott csoportok erőforrásait.

### Cgroup létrehozása

Cgroupok kezelésére több eszközünk is van, és ha például C-ben írunk programot, közvetlenül is megcímezhetjük a kernelt. A példa kedvéért itt a `cgroup-bin` csomagban található eszközöket mutatjuk be.

Ha létre akarunk hozni új cgroupot, azt így tehetjük meg:

```
cgcreate -g cpu,cpuacct:/my_group
```

A `-g` paraméternél két dolgot kell megadnunk: hogy melyik cgroupokat szeretnénk használni, és mi legyen a cgroup neve. Az előbbiről mindjárt még többet.

Ha szeretnénk egy már létező folyamatot betenni egy cgroupba, az rendkívül egyszerű a `cgclassify` paranccsal a PID megadásával:

```
cgclassify -g cpu,cpuset:/my_group 1234
```

Törölni pedig a `cgdelete` paranccsal tudjuk.

### Cgroupok korlátozása

Nem vesszük végig az összes lehetőséget részletesen, de nézzünk néhány példát. Ha például szeretnénk korlátozni egy cgroupot egy megadott CPU magra, ezt így tehetjük meg:

```
echo "2,3,4" > /sys/fs/cgroup/cpuset/my_group/cpuset.cpus
```

Ennek hatására a nevezett cgroup már csak a 2, 3 és 4 CPU magon fog futni. Hasonló módon rendelkezésre állnak, többek között, az alábbi limitek:

|  | <th>`cpu.shares`</th> |  | CPU sávszélesség részek. A teljes rendelkezésre álló CPU kapacitás a share-k arányában kerül elosztásra. |  |
|---|-----------------------|---|----------------------------------------------------------------------------------------------------------------------|---|
|  | <th>`cpu.rt_runtime_us`</th> |  | Ennyi mikroszekudumnyi CPU-t kap egységenként az adott csoport. |  |
|  | <th>`cpu.rt_period_us`</th> |  | Elosztási egységek hossza valós idejű CPU kapacitásra.. |  |
|  | <th>`memory.limit_in_bytes`</th> |  | A csoport TELJES memóriahasználatát korlátozza, beleértve a file cachet. |  |
|  | <th>`memory.memsw.limit_in_bytes`</th> |  | Korlátozza a csoport memória ÉS swap fogyasztását. |  |
|  | <th>`blkio.throttle.read_bps_device`</th> |  | Merevlemez olvasási sávszélesség byte per másodpercben. |  |
|  | <th>`blkio.throttle.read_iops_device`</th> |  | Merevlemez olvasási sávszélesség IO művelet per másodpercben. |  |
|  | <th>`blkio.throttle.write_bps_device`</th> |  | Merevlemez írási sávszélesség byte per másodpercben. |  |
|  | <th>`blkio.throttle.write_iops_device`</th> |  | Merevlemez írási sávszélesség IO művelet per másodpercben. |  |

## Namespacek

A [Docker kapcsán](https://www.refaktor.hu/docker-a-kontener-alapu-virtualizacio-1-resz/) már beszéltünk arról, hogy hogyan alakult át a Linux kernel a konténeres virtualizációnak köszönhetően. Fejtsük ki ezt egy kicsit!

A Linux kernel az OpenVZ és a Linux-Vserver projekteknek köszönhetően rengeteg technológiát kapott arra, hogy bizonyos folyamatokat le lehessen választani a gazdagépről. Ha egy folyamatot namespace-ben indítunk, a megadott névterek szempontjából az adott folyamat és az összes alfolyamata úgy fog viselkedni, mintha egy önálló gép lenne.

|  | <th>Cgroup</th> |  | Önálló cgroupok. |  |
|---|-----------------|---|---------------------|---|
|  | <th>IPC</th> |  | Folyamatok közötti kommunikáció. |  |
|  | <th>Network</th> |  | Önálló hálózat kezelés. (Saját, virtuális hálózati kártyák, IP címek, stb.) |  |
|  | <th>Mount</th> |  | Önálló mountok kezelése |  |
|  | <th>PID</th> |  | Önálló process ID-k. A namespaceben futó 1-s PID a gazdagépben például a 10001-es PID lesz, az 2-es 10002, stb. |  |
|  | <th>User</th> |  | Önálló User ID-k. A namespaceben root-nak látszódó felhasználó a gazdagépen nem lesz root. |  |
|  | <th>UTS</th> |  | Önálló gépnév beállítás. |  |

Látható, hogy ezekkel az eszközökkel akár egy teljes virtuális gépet, containert hozhatunk létre. Pontosan ez az, amit az LXC csinál, de a szerencsénk az, hogy nem kell az összes namespace-t felhasználnunk. Ha például szeretnénk csak önálló PID kezelést adni a folyamatainknak, erre minden lehetőségünk adott.

A namespacek kezelése C-ben a `clone()`, `setns()` és `unshare()` parancsokkal történik, azonban néhány parancssori eszköz is adott. Így például a `newpid` eszközzel önálló PID namespace-ben indíthatunk folyamatot:

```
$ newpid bash
$ ps auwfx
USER       PID %CPU %MEM    VSZ   RSS TTY      STAT START   TIME COMMAND
root         1  0.0  0.0   4188    84 pts/0    S    09:20   0:00 newpid bash
root         2  2.6  0.6  22372  3436 pts/0    S    09:20   0:00 bash
root        14  0.0  0.2  18440  1196 pts/0    R+   09:20   0:00  \_ ps auwfx
```

Mint látható, az új PID namespace-ben hiába listázzuk az összes folyamatot, nem fogjuk látni az gazda namespaceben futó folyamatokat.

## AppArmor

Néha nem elegendő, vagy nem alkalmazható a chroot(), mégis meg kell védeni a fájlokat egy bizonyos programtól a gépen. Ezekre az esetekre kernel kiegészítők készülnek, amik finomhangolt hozzáférés vezérlést (access control) tesznek lehetővé. Ezeket MAC (Mandatory Access Control) vagy RBAC (Role Based Access Control) néven is emlegetik. Az egyik ilyen rendszer az AppArmor, amely az Ubuntuban alapértelmezetten rendelkezésre áll.

A használata meglehetősen egyszerű. A megfelelő eszközök feltelepítése után (Ubuntuban: `apt-get install apparmor-utils`) lehetőségünk van először gyűjtési üzemmódban elindítani az AppArmort:

```
aa-autodep /opt/myapp/myapp.sh
```

Ezek után beállíthatjuk az alkalmazást *complain* módba. Így csak logolásra kerülnek a fájl-hozzáférések. Az `aa-logprof` paranccsal engedélyezhetjük vagy tilthatjuk a hozzáférést, ami be is kerül az adott alkalmazás profiljába. A kész profilt a `/etc/apparmor.d` könyvtárban találjuk.

Ha elégedettek vagyunk a profillal, az `aa-enforce` paranccsal átkapcsolhatjuk az AppArmort olyan üzemmódba, hogy a profilnak nem megfelelő fájlhozzáféréseket automatikusan tiltsa.

## seccomp, avagy a rendszerhívások tiltása

Ha a fenti technikák mindegyikét bevetettük, a rendszerünk egész jó védelemmel rendelkezik. A szóban forgó alkalmazás nem használhat túl sok erőforrást, nem férhet hozzá illetéktelenül fájlokhoz. Egy dologgal azonban még nem foglalkoztunk: a rendszerhívásokkal (syscallokkal). Ezek függvények, amiket a kernel (rendszermag) bocsájt rendelkezésünkre, például fájl megnyitásra (open) vagy hálózatkezelésre. Mondanom sem kell, ezekből rengeteg van, és mindeddig a programunk bármelyiket használhatta, amihez nem kellett root jog vagy capability.

A seccomp projekt eredetileg a Google Chromeból indult azzal a céllal, hogy lehetőséget teremtsen bizonyos kódrészek teljes leválasztására. Az ezzel leválasztott processek kizárólag az `exit()`, `sigreturn()`, `read()` és `write()` syscallokat használhatták már megnyitott fájlokon. Ha a program megpróbált egy másik syscallt használni, azonnal leállításra került. Ez különösen hasznos volt az olyan pluginek futtatására, mint a méltán rossz hírnek örvendő Adobe Flash.

A seccomp később kiterjesztésre került seccomp-bpf néven, amely lehetővé tette azt, hogy ne csak ezt a négy syscallt engedélyezzük, hanem a Berkeley Packet Filter segítségével konfigurálhatóvá tegye, hogy mely syscallok hívhatóak meg, és melyek ne. Mára már számos projekt integrálta a seccomp-bpf-et, a Chrome mellett a Vsftpd, OpenSSH, LXD, Firefox, stb.

A technológia sajátosságaiból adódóan a seccomp (tudtommal) nem érhető el egy egyszerű parancssori eszközön keresztül, közvetlenül C kódban kell korlátoznunk a saját processünket. Mint az sejthető, ez a a folyamat nem visszafordítható, vagyis ha egyszer korlátoztunk egy folyamatot, az többet onnan nem jöhet ki.

A seccompot közvetlenül paraméterezhetjük `prctl()` segítségével, de ha szeretnénk egy kicsit barátságosabb programozási felületet, azt a libseccomp függvénykönyvtárral megkapjuk. A seccomp környezet indítása a `seccomp_init()` paranccsal történik, paraméterként pedig átadhatjuk, hogy mi történjen nem engedélyezett syscall hívásakor. A `seccomp_rule_add()` függvénnyel engedélyezhetünk vagy tilthatunk syscallokat, majd ha végeztünk a szabálykészlet összeállításával, a `seccomp_load()` függvény tölti be a szabálykészletet a kernelbe.

```
#include <stdio.h>
#include <stdlib.h>
#include <seccomp.h>
#include <fcntl.h>
#include <errno.h>

int main()
{
	int ret;
	scmp_filter_ctx ctx;

	ctx = seccomp_init(SCMP_ACT_KILL);
	if (ctx == NULL) {
		printf("Failed initializing seccomp\n");
		exit(1);
	}
	ret = seccomp_rule_add(ctx, SCMP_ACT_ALLOW, SCMP_SYS(exit_group), 0);
	if (ret < 0) {
		printf("Failed allowing exit_group via seccomp\n");
		exit(1);
	}
	ret = seccomp_rule_add(ctx, SCMP_ACT_ALLOW, SCMP_SYS(mprotect), 0);
	if (ret < 0) {
		printf("Failed allowing mprotect via seccomp\n");
		exit(1);
	}
	ret = seccomp_rule_add(ctx, SCMP_ACT_ALLOW, SCMP_SYS(munmap), 0);
	if (ret < 0) {
		printf("Failed allowing munmap via seccomp\n");
		exit(1);
	}
	ret = seccomp_rule_add(ctx, SCMP_ACT_ALLOW, SCMP_SYS(brk), 0);
	if (ret < 0) {
		printf("Failed allowing brk via seccomp\n");
		exit(1);
	}
	ret = seccomp_load(ctx);
	if (ret < 0) {
		printf("Failed loading seccomp\n");
		exit(1);
	}

	printf("Hello world!\n");
	return 0;
}
```

Ezt lefordítva a `gcc seccomptest.c -lseccomp` paranccsal, majd elindítva látni fogjuk, hogy a program futása az utolsó `printf` sornál egy `SIGSYS` jelzéssel leáll.

## Összefoglaló

A Linux hű marad az elveihez, rengeteg eszközt ad a kezünkbe, összerakni azonban nekünk kell. Remélhetőleg a cikkünk betekintést nyújtott, hogy miből választhatsz, ha kevésbé kiváló szoftvereket kell üzemeltetned.

Természetesen rengeteg olyan eszköz van, amit itt még csak meg sem említettünk. Ilyen a [SELinux](https://selinuxproject.org/) vagy a [grsecurity](https://grsecurity.net/). Ha a felsorolt eszközök nem váltják be a hozzá fűzött reményeket, érdemes ezeket is megnézned.

## További olvasni való

- [Control groups series by Neil Brown](https://lwn.net/Articles/604609/)
- [Namespaces in operation](https://lwn.net/Articles/531114/#series_index)
- [systemd.resource-control — Resource control unit settings](https://www.freedesktop.org/software/systemd/man/systemd.resource-control.html)