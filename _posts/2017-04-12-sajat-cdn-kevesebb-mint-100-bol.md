---
id: 2010
title: 'Saját CDN kevesebb mint 100$-ból?'
date: '2017-04-12T07:17:20+02:00'
author: janoszen
layout: post
guid: 'https://www.refaktor.hu/?p=2010'
permalink: /2017/04/12/sajat-cdn-kevesebb-mint-100-bol/
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
    - '3841'
avada_post_views_count:
    - '3841'
sbg_selected_sidebar:
    - 'a:1:{i:0;s:1:"0";}'
sbg_selected_sidebar_replacement:
    - 'a:1:{i:0;s:12:"Blog Sidebar";}'
sbg_selected_sidebar_2:
    - 'a:1:{i:0;s:1:"0";}'
sbg_selected_sidebar_2_replacement:
    - 'a:1:{i:0;s:0:"";}'
newsphere-meta-content-alignment:
    - align-content-left
image: 'assets/uploads/2017/04/29123542/41318584_l.jpg'
categories:
    - Üzemeltetés
tags:
    - AWS
    - CDN
    - DNS
    - docker
---

Aki dolgozott már velem az tudja, hogy ha egy mód van rá, nem a szokványos megoldásokat választom. Az elmúlt hónapok műszaki kalandozásai az Amazon Web Services tengereire sodortak, és a sok munka mellett kipottyant a projektből némi melléktermék is. Na de nem az a fajta melléktermék amitől sürgősen igyekszünk megszabadulni, hanem egy izgalmas kis kisérlet: építsünk saját CDN-t havi kevesebb mint 100$-ból.

## Mi is az a CDN?

Na de, mielőtt belecsapunk a lecsóba, mi is az a CDN (Content Delivery Network) valójában? Ha elolvasunk bármilyen tutorialt, valószínűleg olyanokat fogunk találni, hogy ez egy világszintű tartalom kiszolgáló hálózat, amit jó pénzért igénybe vehetünk és ettől majd gyorsabb lesz az oldalunk. Ha nem csak a marketingrizsát olvassuk el, arra is rájövünk, hogy ez bizony csak akkor igaz, ha nem dinamikus tartalomról van szó. Vagyis a CDN használata leginkább a weboldalunkhoz tartozó képek, szöveges állományok (CSS, stb) gyorsulását hozza magával.

Nézzünk egy példát. Beállítunk egy aldomaint a CDN-re, mondjuk legyen ez a példa kedvéért `static.example.com`. Ezt az aldomaint természetesen megfelelően bekonfiguráljuk úgy, hogy ha egy adott fájlt a CDN nem talál, akkor azt töltse le a szerverünkről. A szerverünkön a statikus tartalmak URL-jeit úgy generáljuk, hogy azok mindig egyediek legyenek, így a CDN hosszú ideig gyorstárazhatja a kérdéses tartalmat.

![](assets/uploads/2017/04/cdn.png)

Mint az ábrán látható, a statikus tartalmakat a CDN-en keresztül szolgáljuk ki, míg a dinamikus, pl. PHP programra irányuló kérések közvetlenül a szerverünkön kötnek ki. Ez azért jó, mert jó esetben az oldal betöltési idő nagyrészét a statikus tartalmak teszik ki.

Na de ezzel van ám egy kis probléma. Ha egy adott tartalom nem található az adott CDN szerveren, akkor azt előbb be kell szereznie. Vagyis ahelyett hogy gyorsabb lenne, a kívánt statikus tartalom betöltése még plusz időt vesz igénybe. Naívan gondolhatnánk azt, hogy ez úgyis ritkán fog előfordulni, ám egy kis forgalmú oldalnál koránt sincs így.

Ugyan vannak technikák ezen probléma kiküszöbölésére, például előre feltölthetjük a tartalmakat a CDN-be, de a lényegen nem változtat: egy kis forgalmú oldallal a CDN nem fog olyan jól teljesíteni mint egy nagy forgalmú oldalnál.

## A projekt

Miután az elmúlt néhány hónapban szép hosszú munkanapokat töltöttem hasonló projektek megvalósításával, úgy gondoltam hogy érdekes kihívás lenne az angol testvéroldalt, a [refactor.zone](https://refactor.zone)-t átültetni egy saját CDN megoldásra. Az első verzióban az a cél, hogy az oldal másolatait elhelyezzük egy-egy Amazon EC2 példányon és onnan szolgáljuk ki az adott régió forgalmát. További verziókban aztán majd bővítjük szerkesztő felülettel és egyéb huncutságokkal.

Azt remélhetőleg mondanom sem kell, hogy a projekt meglehetősen kisérleti és koránt sincs olyan állapotban hogy ezen leírást követve egy üzleti alapokon nyugvó oldal elhelyezhető legyen rajta.

## Az eszközök

Mielőtt neki állunk bőszen konfigurálni, először is gondolkodjuk egy kicsit. Először is kell valamilyen virtuális gép ami képes PHP-t futtatni és statikus fájlokat kiszolgálni. Ez önmagában nem nagy kihívás, és ha már Amazon, akkor régiónként egy t2.nano EC2 példány megteszi. Ennek a hozzávetőleges ára havi 8-9 USD per darab, így a költségvetésünkből egy 6-8 végponttal rendelkező hálózat kényelmesen kijön. A t jelzésű EC2 instance-okkal csak arra kell figyelni, hogy ezeknek burst-alapú a CPU limitje, tehát könnyen felemészthetjük a CPU creditünket és utána elérhetetlen lesz a gép. Éppen ezért erre be fogunk állítani gépenként egy CloudWatch riasztást.

Ha már a gépeknél tartunk, valahogyan menedzselni kell a konfigurációt, ami egy 512 MB RAM-mal rendelkező gépnél igen csak érdekes lenne pl. Puppettal. Éppen ezért az egész feladatot agyoncsapjuk azzal, hogy Docker containerben futtatjuk az oldalt. Szerencsére az Amazon itt is ad eszközt, méghozzá az Elastic Container Service-t (ECS). Sokszor még erősen gyerekcipőben jár, de erre a feladatra pont alkalmas lesz, így a gazdagépeinken telepítjük az [ECS agentet](https://github.com/aws/amazon-ecs-agent) és máris kattintós felületen vezérelhetjük a Docker dobozainkat. Ezzel ugyan nem menekülünk meg a gazdagép karbantartási feladataitól, de a csekély szoftvermennyiség miatt jelentősen csökkenteni tudjuk a munkaigényt.

A rendszerünk következő eleme a DNS szerver lesz. Ennek nem csak hogy régiótól függően más és más IP-t kell visszaadnia, hanem még arra is figyelnie kell, hogy ha egy gépen megszűnik a szolgáltatás, akkor helyette terelje át a forgalmat máshová. Annál is inkább, mert régiónként csak egyetlen EC2-t futtatunk, nincs redundancia és a szoftverfrissítés leállással fog járni. Mondanom sem kell, hogy az Amazon itt is segítségünkre van. A Route53 DNS szolgáltatásnál 50 centet fizetünk zónánként, valamint további 50 centet beállított healthcheckenként. Végpontonként egy healthcheck-kel megússzuk a kérdést, így ez sem lesz túl drága. Maga a késleltetés-alapú DNS kiszolgálás 60 centbe kerül millió lekérésenként, úgyhogy ezzel is bőségesen a költségkereten belül maradunk.

## Beállítás

Először is el kell döntenünk hogy milyen régiókat szeretnénk kiszolgálni. Én a us-east-1, us-west-1, eu-west-1, eu-central-1, ap-northeast-1 és ap-southeast-2 régiók mellett döntöttem, mert ezekben elérhető az ECS és le tudtam fedni az egész Földgömböt. Első lépésként minden régióban lefoglaltam egy Elastic IP-t hogy fix IP-t tudjak adni a végpontoknak. Ezekre az IP-kre aztán beállítottam egy health check-et a Route53-ban. Szépen fel is jött mindegyik pirossal, hiszen miért is működne az oldal.

![](assets/uploads/2017/04/Screenshot-from-2017-04-11-18-21-28.png)

Következő lépésként feltelepítettem az EC2 containereket. Ugyan az ECS ezt megtenné helyettem, de csak és kizárólag az Amazon ECS-optimized változatban, amit én annyira nem kedvelek. Na itt nem kell nagy dologra gondolni telepítés címén, az EC2 user data részben feltöltöttem egy scriptet ami lefuttatja a rendszer frissítéseket és beteszi az SSH kulcsomat, valamint feltelepíti az ECS agentet. Nagyjából így:

```
#!/bin/bash

set -e

mkdir -p /etc/ecs

echo ECS_CLUSTER=refactorzone > /etc/ecs/ecs.config

apt-get -y update && apt-get -y upgrade && apt-get -y dist-upgrade
apt-get -y install docker.io

mkdir -p /var/log/ecs /etc/ecs /var/lib/ecs/data
sysctl -w net.ipv4.conf.all.route_localnet=1
iptables -t nat -A PREROUTING -p tcp -d 169.254.170.2 --dport 80 -j DNAT --to-destination 127.0.0.1:51679
iptables -t nat -A OUTPUT -d 169.254.170.2 -p tcp -m tcp --dport 80 -j REDIRECT --to-ports 51679
docker run --name ecs-agent \
    --detach=true \
    --restart=on-failure:10 \
    --volume=/var/run/docker.sock:/var/run/docker.sock \
    --volume=/var/log/ecs:/log \
    --volume=/var/lib/ecs/data:/data \
    --net=host \
    --env-file=/etc/ecs/ecs.config \
    --env=ECS_LOGFILE=/log/ecs-agent.log \
    --env=ECS_DATADIR=/data/ \
    --env=ECS_ENABLE_TASK_IAM_ROLE=true \
    --env=ECS_ENABLE_TASK_IAM_ROLE_NETWORK_HOST=true \
    amazon/amazon-ecs-agent:latest

useradd -m -s /bin/bash janoszen
mkdir /home/janoszen/.ssh
echo 'ssh-rsa AAAAB...' >/home/janoszen/.ssh/authorized_keys
gpasswd -a janoszen sudo

echo 'Defaults	env_reset
Defaults	mail_badpass
Defaults	secure_path="/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin:/snap/bin"
root	ALL=(ALL:ALL) ALL
%admin ALL=(ALL) NOPASSWD: ALL
%sudo	ALL=(ALL:ALL) NOPASSWD: ALL' >/etc/sudoers

```

Miután ezzel megvoltam, beállítottam az Amazon felületen a megfelelő security groupokat, hiszen hiába van webszerverünk ha utána a 80-as porton nem tudunk becsatlakozni. Végezetül nem volt más hátra, mint előállítani a Docker containert az nginx-el, PHP-val és a hozzá tartozó weboldallal és ezt kitenni minden régióban a gépekre, valamint beállítani a Route53-ban a megfelelő rekordokat:

```
ap-northeast-1._geobalance.refactor.zone. IN A 13.113.115.6
ap-southeast-2._geobalance.refactor.zone. IN A 52.63.65.246
eu-central-1._geobalance.refactor.zone.   IN A 35.157.202.62
eu-west-1._geobalance.refactor.zone.      IN A 54.76.123.23
us-east-1._geobalance.refactor.zone.      IN A 34.198.182.40
us-west-1._geobalance.refactor.zone.      IN A 52.9.133.139

_geobalance.refactor.zone. ALIAS ap-northeast-1._geobalance.refactor.zone.
_geobalance.refactor.zone. ALIAS ap-southeast-2._geobalance.refactor.zone.
_geobalance.refactor.zone. ALIAS eu-central-1._geobalance.refactor.zone.
_geobalance.refactor.zone. ALIAS eu-west-1._geobalance.refactor.zone.
_geobalance.refactor.zone. ALIAS us-east-1._geobalance.refactor.zone.
_geobalance.refactor.zone. ALIAS us-west-1._geobalance.refactor.zone.

refactor.zone.     ALIAS _geobalance.refactor.zone.
www.refactor.zone. ALIAS _geobalance.refactor.zone.
```

Az ALIAS rekordok, mint sejtheted, a Route53-ra jellemző állatfajok. Ez annyit tesz, hogy itt a beállítástól és a healthchecktől függően a DNS szerver más és más eredményt ad vissza, ez esetben a hálózati késleltetés alapján.

## Eredmények

Miután mindezt elkövettem, elégedetten konstatáltam, hogy a bolygó különböző pontjairól végzett mérések egyaránt kellemes betöltési sebességeket adtak. Talán mondanom sem kell, hogy ez a megoldás nem skálázódik magától, és ha egy gép kiesik, akkor automatikusan a legközelebbi régióból kerül kiszolgálásra a tartalom. De egy ilyen kis oldalnál ez talán nem is szempont. Sokkal inkább az volt a célom, hogy bemutassam, nem akkora hatalmas ördöngősség a ma rendelkezésre álló eszközökkel egy világméretű tartalomszóró hálózatot építeni.

![](assets/uploads/2017/04/Screenshot-from-2017-04-11-18-23-55.png)

## További lépések

Nem véletlenül választottam ezt az oldalt. Gyakorlatilag az összes lapja legenerálható lenne HTML formában, egy-két kivétellel. Szinte semmilyen adatbeviteli megoldás nincs, és nem kell foglalkoznom az esetlegesen technikailag nem képzett cikk íról által egy admin felületen előállított tartalommal. Éppen ezért a git repositorymból buildelt Docker image tökéletesen megfelel a tartalom terjesztési feladatnak.

A későbbekben szeretném lecserélni a PHP-s oldalmotort egy Java-ban írt változatra, potenciálisan IPFS vagy másmilyen elosztott tartalomtároló backendre. Ez aztán izgalmas problémákat fog felvetni az ütközések kezelése terén, de az egy másik cikk témája lesz. Ezen felül szeretném kiterjeszteni a monitorozást, végpontonként mérni, hogy mennyi a tényleges válaszidő, valamint azt, hogy mennyivel teljesít jobban egy egy helyen hostolt oldalnál.