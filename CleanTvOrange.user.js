// ==UserScript==
// @name            CleanTvOrange
// @name:fr         Nettoyeur tv d'orange
// @namespace       Crabman
// @version         1.0
// @description     Hides paid/unwanted channels for + readability and places favorites at the top of the list. You can have 2 favorite categories, for example the ones you watch all the time, then the ones you monitor, or maybe just the channels for the kids.
// @description:fr  Cache les chaines payantes/non désirées pour + de lisibilité et place les favorites en haut de la liste. Vous pouvez avoir 2 catégories favorites, par exemple celles dont vous regardez tout le temps, puis celles dont vous surveillez, ou peut être juste les chaines pour les enfants.
// @author          Crabman77
// @match           https://tv.orange.fr/*
// @icon            data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABAEAYAAAD6+a2dAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAADsAAAA7ABJ8QPrQAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAASzSURBVHic7Zy/TxRBFMe/Gg2QkHBSagEGSwg0QCdQQUM4CgsNhBP+AGit+FVQUAAJJJCgQAJagp12YkEhjQZKTKCAUjAhEX8QbPxmyZhlf9zM3s7O+zQX7rjZzb7ve/Pem5m7dXU1MwNcXUFwktulvgGhtIgAHEcE4DgigIwwMrK5CQC53IsXAHB4+O1bmO+JACxndfXTJwCYm/v4EQC+f7+4AEQAzjA29u7d9b8HBpqbAaC9/dGjMN8XAVgKPf/o6PT0+vtjY11dUcYRAViK6vmjo52dAFBbW10dZRwRgGWonl9VVV4OACMjbW1xxhMBaCJs0hWXs7MfPwAv2ycM+blcRUWcca0TAD0gLWxt7e0BwMOHk5OAZyjdzM5ubwNell9Tc+8eEN/ziTUCoIc9f/7mDeA9+FJBQxcKr18D3hwc1xODrkMBkKjJnh/WCIDJDR80H7wpjwuCSRgNXqwn+qF6fltbXR0AFAotLTrGt0YAhMqnIPL5ly+TvP6HDwcHgNd4mZ3t7QXs83xinQDI1tbQEAB8/nx8DPz/oEzBJIyemM83NJi4jur5PT319UD4Bk9YrBUAIwA9giGZgtANx//y5eQEAFZXnz0zcR3mOuPj799ff5+RRjfWCoBw7qVnMDfQBQ1Cj4zbcAmLX2vX1PWsFwChR9Jg6oOMCwVlOtnjfa+t7e4CXoPHlOeTzAiABqIQGEKZtEWFZeb29tevgLlkj6iCpdBMXY/cMTl4KWBSNjz8+DEA9PWtrwPA4uKTJwBQWVlWdtP3z89//gSA/v6NDcB8sqd6vq4GT1gyJwDC5HBpaWcHALq7l5fjjGMq2SO6W7tRyawA+ABbW2tqAC9JDKqjOWV0dCwsAOaSL17n7dv9fcDzfF0NnrDcMrUtnD37UvfuWbZdXPz+DQDl5Xfv3vT/f/5cXgLA+fmvX4A3BZi6LzZ8Ghvv3wc84apJp+76n2gXgOpBQnGwGjg7m5oyMX5mqoCswk6gKRLPAdhIcQ0122fIZ3Whfp4UiQtA92KGLagbRtRFLU6dSQtApgDDsKGkNqpMVRdREQEYgh7f2/vqFQA0NU1PA6Xbv+CHCMAQamuX9X1SDZ6wZLYRlDRchuZc3tT04MH1z9Oa+4gAYsIGF1u5fuVa2qsemQIiQsNzc2pQna5u7EgbIoCQqIaPiulzA3ERAQRQrOGJCMAydBmeqElhWpAkUIFbwHR15LiYk7byj0gE+Iduw5O0ej5xNgKwI9fePj8PeOvzukm7AJyLAGENz9W6YjG1kUMXzgiAnbra2okJwN/wKytPnwLBm0DD7hQSAZQYGp4e79e4mZnJ5wHP8H5HzWj4IMPyKFdakz/iTA7As4Ssx/mq7r3jIo6fULioE3TewNQ2ct1kXgBRkzB6NiMHd+0SGtZvsyvLvqR398Yl8wKICgXAV0YKenxQSLfF80nmc4Bi4c4d1aP9IktSJ3p0IQKICc8Kbm4ODgJe2Zj2ul9FpoAiYci3LfQTiQCOIwJwnMSngLjn9bOOqZ+2CSJxAciZwXQhU4DjaBcA62aedxeKg2sKpjD2+wCCHcgU4DgiAMcRATiOCMBxRACOIwJwHBGA44gAHOcvzJJGrbSbF/wAAAAASUVORK5CYII=
// @grant           GM_registerMenuCommand
// @grant           window.onurlchange
// @grant           GM_addStyle
// @grant           GM_getValue
// @grant           GM_setValue
// @run-at document-idle
// ==/UserScript==

(function() {
    'use strict';
    const config = {};
    config.channels = GM_getValue("channels", {});
    config.hideIsPaid = GM_getValue("hideIsPaid", false);
    config.volume = GM_getValue("volume", "100");
    const listedChannels = [];
    const paidChannels = {};
    const options = {"Enlever": "0", "Normal": "1", "Favori 1": "2", "Favori 2": "3"};
    const channelsInfo = {'01tv': {'name': 'Tech&Co', 'category': 'Actu Tech', 'langue': 'fr', 'number': '141'},
                          '13eme_rue': {'name': '13EME RUE', 'category': 'Cinéma', 'langue': 'fr', 'number': '84'},
                          '20_minutes_tv_idf': {'name': '20 minutes TV IDF', 'category': 'Locales', 'langue': 'fr', 'number': '349'},
                          '2mmonde': {'name': '2M Monde', 'category': 'Généraliste/Maroc', 'langue': 'ar', 'number': '521'},
                          '2stv': {'name': '2STV', 'category': 'Généraliste/Sénégal', 'langue': 'fr', 'number': '591'},
                          '6ter': {'name': '6TER', 'category': 'Généraliste', 'langue': 'fr', 'number': '22'},
                          'a3_series': {'name': 'A3 SERIES', 'category': 'Séries/Divertissement', 'langue': 'ar', 'number': '436'},
                          'AB1': {'name': 'AB1', 'category': 'Divertissement/Séries', 'langue': 'fr', 'number': '81'},
                          'AB_motors': {'name': 'AUTOMOTO, la chaine', 'category': 'Automobile', 'langue': 'fr', 'number': '196'},
                          'abolatv': {'name': 'A BOLA TV', 'category': 'Sport/Football', 'langue': 'pt', 'number': '454'},
                          'action': {'name': 'ACTION', 'category': 'Cinéma/Action', 'langue': 'fr', 'number': '64'},
                          'africa24': {'name': 'AFRICA 24', 'category': 'Information internationale', 'langue': 'fr', 'number': '239'},
                          'al_jazeera': {'name': 'AL JAZEERA Arabic', 'category': 'Information internationale', 'langue': 'ar', 'number': '241'},
                          'al_jazeera_anglais': {'name': 'AL JAZEERA English', 'category': 'Information internationale', 'langue': 'en', 'number': '238'},
                          'al_maghribia': {'name': 'AL MAGHRIBIA', 'category': 'Généraliste', 'langue': 'ar', 'number': '496'},
                          'al_rawda': {'name': 'AL RAWDA', 'category': 'Culture/Islam', 'langue': 'ar', 'number': '531'},
                          'al_resalah': {'name': 'AL RESALAH', 'category': 'Religion/Islam', 'langue': 'ar', 'number': '514'},
                          'alaoula': {'name': 'AL AOULA', 'category': 'Généraliste', 'langue': 'ar', 'number': '504'},
                          'alarabiya': {'name': 'AL ARABIYA', 'category': 'Actualités', 'langue': 'ar', 'number': '501'},
                          'alaraby2': {'name': 'ALARABY TELEVISION', 'category': 'Actualités/Divertissement général', 'langue': 'ar', 'number': '503'},
                          'all_flamenco': {'name': 'ALL FLAMENCO', 'category': 'Musique/Flamenco', 'langue': 'es', 'number': '438'},
                          'alma_lusa': {'name': 'ALMA LUSA', 'category': 'Culture/Portugal', 'langue': 'pt', 'number': '453'},
                          'alpe_d_huez_television': {'name': "Alpe d'Huez TV", 'category': 'Locales', 'langue': 'fr', 'number': '360'},
                          'angers_television': {'name': 'ANGERS TELE', 'category': 'Locales', 'langue': 'fr', 'number': '344'},
                          'Animaux': {'name': 'ANIMAUX', 'category': 'Documentaire/Nature', 'langue': 'fr', 'number': '120'},
                          'antena_3': {'name': 'ANTENA 3', 'category': 'Généraliste/Espagne', 'langue': 'es', 'number': '434'},
                          'aplus': {'name': 'A+', 'category': 'Divertissement/Séries', 'langue': 'fr', 'number': '598'},
                          'arirang_tv': {'name': 'ARIRANG TV', 'category': 'Culture/Actualités internationales', 'langue': 'en', 'number': '566'},
                          'armenia1': {'name': 'ARMENIA 1', 'category': 'Généraliste', 'langue': 'hy', 'number': '468'},
                          'arryadia': {'name': 'ARRYADIA', 'category': 'Sport', 'langue': 'ar', 'number': '498'},
                          'arte': {'name': 'ARTE', 'category': 'Culture/Documentaire', 'langue': 'fr/de', 'number': '7'},
                          'arte_enallemand': {'name': 'ARTE Allemand', 'category': 'Internationales', 'langue': 'de', 'number': '418'},
                          'asharq_news': {'name': 'ASHARQ NEWS', 'category': 'Actualités économiques', 'langue': 'ar', 'number': '248'},
                          'astrocenter': {'name': 'ASTRO CENTER', 'category': 'Astrologie/Bien-être', 'langue': 'fr', 'number': '210'},
                          'athaqafia': {'name': 'ATHAQAFIA', 'category': 'Culture', 'langue': 'ar', 'number': '497'},
                          'BBC_world_UMTS': {'name': 'BBC NEWS', 'category': 'Actualités internationales', 'langue': 'en', 'number': '237'},
                          'beijing_tv': {'name': 'BEIJING TV', 'category': 'Généraliste/Chine', 'langue': 'zh', 'number': '558'},
                          'beinsport1': {'name': 'BEIN SPORTS 1', 'category': 'Sport', 'langue': 'fr', 'number': '50'},
                          'beinsport2': {'name': 'BEIN SPORTS 2', 'category': 'Sport', 'langue': 'fr', 'number': '51'},
                          'beinsportsmax10': {'name': 'beIN Sports Max 10', 'category': 'Sport', 'langue': 'fr', 'number': '185'},
                          'beinsportsmax3': {'name': 'BEIN SPORTS 3', 'category': 'Sport', 'langue': 'fr', 'number': '52'},
                          'beinsportsmax4': {'name': 'beIN Sports Max 4', 'category': 'Sport', 'langue': 'fr', 'number': '179'},
                          'beinsportsmax5': {'name': 'beIN Sports Max 5', 'category': 'Sport', 'langue': 'fr', 'number': '180'},
                          'beinsportsmax6': {'name': 'beIN Sports Max 6', 'category': 'Sport', 'langue': 'fr', 'number': '181'},
                          'beinsportsmax7': {'name': 'beIN Sports Max 7', 'category': 'Sport', 'langue': 'fr', 'number': '182'},
                          'beinsportsmax8': {'name': 'beIN Sports Max 8', 'category': 'Sport', 'langue': 'fr', 'number': '183'},
                          'beinsportsmax9': {'name': 'beIN Sports Max 9', 'category': 'Sport', 'langue': 'fr', 'number': '184'},
                          'bet': {'name': 'BET', 'category': 'Divertissement/Culture afro-américaine', 'langue': 'en', 'number': '77'},
                          'beur_fm_tv': {'name': 'BEUR FM TV', 'category': 'Culture/Divers', 'langue': 'fr', 'number': '500'},
                          'bfm_lyon': {'name': 'BFM LYON', 'category': 'Information', 'langue': 'fr', 'number': '341'},
                          'bfm_marseille': {'name': 'BFM MARSEILLE PROVENCE', 'category': 'Information', 'langue': 'fr', 'number': '342'},
                          'bfmbusiness': {'name': 'BFM BUSINESS', 'category': 'Information', 'langue': 'fr', 'number': '228'},
                          'bfmtv': {'name': 'BFM TV', 'category': 'Information', 'langue': 'fr', 'number': '13'},
                          'bloombergeurope': {'name': 'BLOOMBERG EUROPE', 'category': 'Actualités économiques', 'langue': 'en', 'number': '236'},
                          'boing': {'name': 'CARTOONITO', 'category': 'Jeunesse', 'langue': 'fr', 'number': '96'},
                          'boomerang': {'name': 'BOOMERANG', 'category': 'Jeunesse/Animation', 'langue': 'fr', 'number': '94'},
                          'boomerang_1': {'name': 'BOOMERANG +1', 'category': 'Jeunesse/Animation', 'langue': 'fr', 'number': '95'},
                          'boomerang_vo': {'name': 'BOOMERANG (VO)', 'category': 'Animation/Jeunesse', 'langue': 'fr', 'number': '416'},
                          'bsmart_tv': {'name': 'BSMART 4CHANGE', 'category': 'Économie/Entrepreneuriat', 'langue': 'fr', 'number': '230'},
                          'canal_10_guadeloupe': {'name': 'CANAL 10 Guadeloupe', 'category': 'Généraliste/Local', 'langue': 'fr', 'number': '397'},
                          'canal_24_horas': {'name': 'CANAL 24 HORAS', 'category': 'Actualités', 'langue': 'es', 'number': '437'},
                          'canal_2_int': {'name': 'CANAL 2 INT.', 'category': 'Généraliste', 'langue': 'fr', 'number': '601'},
                          'canal_cinema': {'name': 'CANAL+CINEMA(S)', 'category': 'Cinéma', 'langue': 'fr', 'number': '47'},
                          'canal_j': {'name': 'CANAL J', 'category': 'Jeunesse', 'langue': 'fr', 'number': '98'},
                          'canal_sport': {'name': 'CANAL+SPORT', 'category': 'Sport', 'langue': 'fr', 'number': '44'},
                          'canalalgerie': {'name': 'CANAL ALGERIE', 'category': 'Généraliste', 'langue': 'fr', 'number': '505'},
                          'canalplus': {'name': 'CANAL+', 'category': 'Généraliste', 'langue': 'fr', 'number': '40'},
                          'canalplus_box_office': {'name': 'CANAL+BOX OFFICE', 'category': 'Cinéma', 'langue': 'fr', 'number': '45'},
                          'canalplus_docs': {'name': 'CANAL+DOCS', 'category': 'Documentaire', 'langue': 'fr', 'number': '48'},
                          'canalplus_foot': {'name': 'CANAL+FOOT', 'category': 'Sport', 'langue': 'fr', 'number': '43'},
                          'canalplus_grand_ecran': {'name': 'CANAL+GRAND ECRAN', 'category': 'Cinéma', 'langue': 'fr', 'number': '46'},
                          'canalplus_kids': {'name': 'CANAL+kids', 'category': 'Jeunesse', 'langue': 'fr', 'number': '49'},
                          'canalplus_sport_360': {'name': 'CANAL+SPORT360', 'category': 'Sport', 'langue': 'fr', 'number': '42'},
                          'cctv_4': {'name': 'CCTV 4', 'category': 'Généraliste', 'langue': 'zh', 'number': '551'},
                          'cctv_divertissement': {'name': 'CCTV DIVERTISSEMENT', 'category': 'Divertissement', 'langue': 'zh', 'number': '555'},
                          'cctvf': {'name': 'CGTN Français', 'category': 'Généraliste', 'langue': 'zh', 'number': '550'},
                          'chasseetpeche': {'name': 'CHASSE PECHE', 'category': 'Nature/Chasse/Pêche', 'langue': 'fr', 'number': '122'},
                          'cherie25': {'name': 'CHERIE 25', 'category': 'Divertissement/Vie quotidienne', 'langue': 'fr', 'number': '25'},
                          'china_movie_channel': {'name': 'CHINA MOVIE CHANNEL', 'category': 'Cinéma', 'langue': 'zh', 'number': '554'},
                          'cineplus_classic': {'name': 'Ciné+Classic', 'category': 'Cinéma', 'langue': 'fr', 'number': '59'},
                          'cineplus_club': {'name': 'Ciné+Festival', 'category': 'Cinéma', 'langue': 'fr', 'number': '58'},
                          'cineplus_emotion': {'name': 'Ciné+Emotion', 'category': 'Cinéma', 'langue': 'fr', 'number': '56'},
                          'cineplus_famiz': {'name': 'Ciné+Family', 'category': 'Cinéma', 'langue': 'fr', 'number': '57'},
                          'cineplus_frisson': {'name': 'Ciné+Frisson', 'category': 'Cinéma', 'langue': 'fr', 'number': '55'},
                          'cineplus_premier': {'name': 'OCS', 'category': 'Cinéma', 'langue': 'fr', 'number': '54'},
                          'classica': {'name': 'STINGRAY CLASSICA', 'category': 'Musique/Classique', 'langue': 'fr', 'number': '169'},
                          'clubbingtv': {'name': 'CLUBBING TV', 'category': 'Musique/Vie nocturne', 'langue': 'en', 'number': '155'},
                          'cnbc': {'name': 'CNBC', 'category': 'Actualités économiques', 'langue': 'en', 'number': '235'},
                          'cnn': {'name': 'CNN INTERNATIONAL', 'category': 'Actualités internationales', 'langue': 'en', 'number': '234'},
                          'comedieplus': {'name': 'COMEDIE+', 'category': 'Divertissement', 'langue': 'fr', 'number': '86'},
                          'comedycentral': {'name': 'COMEDY CENTRAL', 'category': 'Humour', 'langue': 'fr', 'number': '82'},
                          'correio': {'name': 'CORREIO DA MANHA TV', 'category': 'Actualités', 'langue': 'pt', 'number': '456'},
                          'CrimeDistrict': {'name': 'CRIME DISTRICT', 'category': 'Série/Crime', 'langue': 'fr', 'number': '121'},
                          'crtv': {'name': 'CRTV', 'category': 'Généraliste', 'langue': 'fr', 'number': '594'},
                          'cstarhits': {'name': 'CSTAR HITS FRANCE', 'category': 'Musique', 'langue': 'fr', 'number': '165'},
                          'demain': {'name': 'DEMAIN', 'category': 'Éducation/Documentaire', 'langue': 'fr', 'number': '219'},
                          'deutschewelle': {'name': 'DEUTSCHE WELLE', 'category': 'Actualités internationales', 'langue': 'de', 'number': '245'},
                          'directstar': {'name': 'CSTAR', 'category': 'Musique/Divertissement', 'langue': 'fr', 'number': '17'},
                          'discovery_investigation': {'name': 'DISCOVERY INVESTIGATION', 'category': 'Crime/Documentaire', 'langue': 'fr', 'number': '116'},
                          'disney_channel': {'name': 'DISNEY CHANNEL', 'category': 'Jeunesse/Divertissement', 'langue': 'en', 'number': '90'},
                          'dreamworks': {'name': 'DREAMWORKS', 'category': 'Jeunesse', 'langue': 'fr', 'number': '103'},
                          'dubaitv': {'name': 'DUBAI TV', 'category': 'Généraliste', 'langue': 'ar', 'number': '502'},
                          'e_entertainment': {'name': 'E!', 'category': 'Divertissement/Célébrités', 'langue': 'fr', 'number': '75'},
                          'Echorouk_News': {'name': 'ECHOROUK NEWS', 'category': 'Actualités', 'langue': 'ar', 'number': '520'},
                          'echorouk_tv': {'name': 'ECHOROUK TV', 'category': 'Généraliste', 'langue': 'ar', 'number': '511'},
                          'el_bilad': {'name': 'EL BILAD TV', 'category': 'Généraliste', 'langue': 'ar', 'number': '527'},
                          'el_hiwar_ettounsi': {'name': 'EL HIWAR ETTOUNSI', 'category': 'Actualités', 'langue': 'ar', 'number': '513'},
                          'encyclopedia': {'name': 'SCIENCE & VIE TV', 'category': 'Documentaire', 'langue': 'fr', 'number': '127'},
                          'ennahar_tv': {'name': 'ENNAHAR TV', 'category': 'Actualités', 'langue': 'ar', 'number': '510'},
                          'equidia': {'name': 'EQUIDIA', 'category': 'Sport', 'langue': 'fr', 'number': '173'},
                          'equinoxe_television': {'name': 'EQUINOXE TELEVISION', 'category': 'Généraliste', 'langue': 'fr', 'number': '588'},
                          'equipe21': {'name': "LA CHAINE L'EQUIPE", 'category': 'Sport', 'langue': 'fr', 'number': '21'},
                          'es1': {'name': 'MGG TV', 'category': 'Jeux vidéo/eSport', 'langue': 'fr', 'number': '140'},
                          'espace_tv': {'name': 'ESPACE TV', 'category': 'Généraliste', 'langue': 'fr', 'number': '589'},
                          'esprit_sorcier_tv': {'name': "L'ESPRIT SORCIER TV", 'category': 'Science/Éducation', 'langue': 'fr', 'number': '111'},
                          'etb_sat': {'name': 'ETB BASQUE', 'category': 'Généraliste', 'langue': 'am', 'number': '440'},
                          'etv': {'name': 'ETV: Télévision Caraïbéenne', 'category': 'Généraliste', 'langue': 'am', 'number': '406'},
                          'eurochannel': {'name': 'EUROCHANNEL', 'category': 'Culturel', 'langue': 'fr', 'number': '65'},
                          'euronews': {'name': 'EURONEWS Français', 'category': 'Actualités internationales', 'langue': 'multilingue', 'number': '229'},
                          'fashiontv': {'name': 'FASHIONTV PARIS', 'category': 'Mode/Divertissement', 'langue': 'en ', 'number': '213'},
                          'food_network': {'name': 'FOOD NETWORK', 'category': 'Cuisine', 'langue': 'en', 'number': '415'},
                          'france2': {'name': 'FRANCE 2', 'category': 'Généraliste', 'langue': 'fr', 'number': '2'},
                          'france24_arabe': {'name': 'FRANCE 24 Arabe', 'category': 'Actualités internationales', 'langue': 'ar ', 'number': '240'},
                          'france24_eng': {'name': 'FRANCE 24 Anglais', 'category': 'Actualités internationales', 'langue': 'en ', 'number': '232'},
                          'france24_espagnol': {'name': 'FRANCE 24 Espagnol', 'category': 'Actualités internationales', 'langue': 'es ', 'number': '247'},
                          'france24_fr': {'name': 'FRANCE 24 Français', 'category': 'Actualités internationales', 'langue': 'fr ', 'number': '225'},
                          'france3': {'name': 'FRANCE 3', 'category': 'Généraliste', 'langue': 'fr', 'number': '3'},
                          'france3alpes': {'name': 'FRANCE 3 ALPES', 'category': 'Généraliste régional', 'langue': 'fr ', 'number': '301'},
                          'france3alsace': {'name': 'FRANCE 3 ALSACE', 'category': 'Généraliste régional', 'langue': 'fr ', 'number': '302'},
                          'france3aquitaine': {'name': 'FRANCE 3 AQUITAINE', 'category': 'Généraliste régional', 'langue': 'fr ', 'number': '303'},
                          'france3auvergne': {'name': 'FRANCE 3 AUVERGNE', 'category': 'Généraliste régional', 'langue': 'fr ', 'number': '304'},
                          'france3bnormandie': {'name': 'FRANCE 3 NORMANDIE CAEN', 'category': 'Généraliste régional', 'langue': 'fr ', 'number': '305'},
                          'france3bourgogne': {'name': 'FRANCE 3 BOURGOGNE', 'category': 'Généraliste régional', 'langue': 'fr ', 'number': '306'},
                          'france3bretagne': {'name': 'FRANCE 3 BRETAGNE', 'category': 'Généraliste régional', 'langue': 'fr ', 'number': '307'},
                          'france3centre': {'name': 'FRANCE 3 CENTRE', 'category': 'Généraliste régional', 'langue': 'fr ', 'number': '308'},
                          'france3champagne': {'name': 'FRANCE 3 CHAMPAGNE ARDENNE', 'category': 'Généraliste régional', 'langue': 'fr ', 'number': '309'},
                          'france3corsevs': {'name': 'FRANCE 3 CORSE VIA STELLA', 'category': 'Généraliste régional', 'langue': 'fr ', 'number': '310'},
                          'france3cteazur': {'name': "FRANCE 3 COTE D'AZUR", 'category': 'Généraliste régional', 'langue': 'fr ', 'number': '311'},
                          'france3frcomte': {'name': 'FRANCE 3 FRANCHE COMTE', 'category': 'Généraliste régional', 'langue': 'fr ', 'number': '312'},
                          'france3hnormandie': {'name': 'FRANCE 3 NORMANDIE ROUEN', 'category': 'Généraliste régional', 'langue': 'fr ', 'number': '313'},
                          'france3languedoc': {'name': 'FRANCE 3 LANGUEDOC', 'category': 'Généraliste régional', 'langue': 'fr ', 'number': '314'},
                          'france3limousin': {'name': 'FRANCE 3 LIMOUSIN', 'category': 'Généraliste régional', 'langue': 'fr ', 'number': '315'},
                          'france3loire': {'name': 'FRANCE 3 PAYS DE LA LOIRE', 'category': 'Généraliste régional', 'langue': 'fr ', 'number': '320'},
                          'france3lorraine': {'name': 'FRANCE 3 LORRAINE', 'category': 'Généraliste régional', 'langue': 'fr ', 'number': '316'},
                          'france3nordpdc': {'name': 'FRANCE 3 NORD P. CALAIS', 'category': 'Généraliste régional', 'langue': 'fr ', 'number': '318'},
                          'france3parisidf': {'name': 'FRANCE 3 PARIS IDF', 'category': 'Régionale', 'langue': 'fr', 'number': '319'},
                          'france3picardie': {'name': 'FRANCE 3 PICARDIE', 'category': 'Régionale', 'langue': 'fr', 'number': '321'},
                          'france3poitou': {'name': 'FRANCE 3 POITOU CHARENTES', 'category': 'Régionale', 'langue': 'fr', 'number': '322'},
                          'france3provence': {'name': 'FRANCE 3 PROVENCE ALPES', 'category': 'Régionale', 'langue': 'fr', 'number': '323'},
                          'france3pyrenees': {'name': 'FRANCE 3 MIDI-PYRENEES', 'category': 'Régionale', 'langue': 'fr', 'number': '317'},
                          'france3rhalpes': {'name': 'FRANCE 3 PROVENCE ALPES', 'category': 'Régionale', 'langue': 'fr', 'number': '323'},
                          'france4': {'name': 'FRANCE 4', 'category': 'Jeunesse', 'langue': 'fr', 'number': '4'},
                          'france5': {'name': 'FRANCE 5', 'category': 'Culturel', 'langue': 'fr', 'number': '5'},
                          'franceinfo': {'name': 'FRANCEINFO', 'category': 'Information', 'langue': 'fr', 'number': '16'},
                          'fusion_tv': {'name': 'FUSION TV', 'category': 'Musique', 'langue': 'fr', 'number': '405'},
                          'game_one_plus1': {'name': 'GAME ONE +1', 'category': 'Jeux vidéo', 'langue': 'fr', 'number': '84'},
                          'gameone': {'name': 'GAME ONE', 'category': 'Jeux vidéo', 'langue': 'fr', 'number': '83'},
                          'GreatWallElite': {'name': 'GREAT WALL ELITE', 'category': 'Documentaire', 'langue': 'zh', 'number': '562'},
                          'guangdong_south_tv': {'name': 'GRT GBA Satellite TV', 'category': 'Généraliste', 'langue': 'zh', 'number': '561'},
                          'gulli': {'name': 'GULLI', 'category': 'Jeunesse', 'langue': 'fr', 'number': '12'},
                          'haberturk': {'name': 'HABERTURK', 'category': 'Actualités', 'langue': 'tr', 'number': '490'},
                          'hd1': {'name': 'TF1 SERIES FILMS', 'category': 'Généraliste', 'langue': 'fr', 'number': '20'},
                          'histoire': {'name': 'HISTOIRE TV', 'category': 'Documentaire', 'langue': 'fr', 'number': '124'},
                          'hlive': {'name': 'HLIVE', 'category': 'Musique', 'langue': 'fr', 'number': '582'},
                          'hunan_world_tv': {'name': 'HUNAN WORLD TV', 'category': 'Généraliste', 'langue': 'zh', 'number': '559'},
                          'i24news': {'name': 'I24NEWS', 'category': 'Actualités', 'langue': 'fr', 'number': '243'},
                          'imearth': {'name': 'IMEARTH', 'category': 'Environnement', 'langue': 'fr', 'number': '115'},
                          'iotv': {'name': 'IO TV', 'category': 'Technologie', 'langue': 'fr', 'number': '402'},
                          'iqraa': {'name': 'IQRAA', 'category': 'Religieux', 'langue': 'ar', 'number': '515'},
                          'iqraa_international': {'name': 'IQRAA INTERNATIONAL', 'category': 'Religieux', 'langue': 'ar', 'number': '516'},
                          'itelevision': {'name': 'CNEWS', 'category': 'Information', 'langue': 'fr', 'number': '14'},
                          'j_one': {'name': 'J-ONE', 'category': 'Divertissement', 'langue': 'ar', 'number': '147'},
                          'jiangsu_international_tv': {'name': 'JIANGSU INTERNATIONAL TV', 'category': 'Généraliste', 'langue': 'zh', 'number': '560'},
                          'journal_du_golf_tv': {'name': 'JOURNAL DU GOLF TV', 'category': 'Sport', 'langue': 'fr', 'number': '172'},
                          'kanal_austral': {'name': 'KANAL AUSTRAL.TV', 'category': 'Généraliste', 'langue': 'fr', 'number': '410'},
                          'kanaldude': {'name': 'Kanaldude', 'category': 'Locales', 'langue': 'fr', 'number': '358'},
                          'kbs_world': {'name': 'KBS WORLD', 'category': 'Généraliste/Culture coréenne', 'langue': 'ko', 'number': '565'},
                          'kmt': {'name': 'KMT', 'category': 'Généraliste', 'langue': 'fr', 'number': '401'},
                          'kourou_tv': {'name': 'KOUROU TELEVISION', 'category': 'Locale', 'langue': 'fr', 'number': '400'},
                          'kto': {'name': 'KTO', 'category': 'Religieux (catholique)', 'langue': 'fr', 'number': '220'},
                          'la_chaine_meteo': {'name': 'LA CHAINE METEO', 'category': 'Météo', 'langue': 'fr', 'number': '231'},
                          'lbc_sat': {'name': 'LBC SAT', 'category': 'Généraliste', 'langue': 'ar', 'number': '533'},
                          'lcimobile_UMTS': {'name': 'LCI', 'category': 'Information', 'langue': 'fr', 'number': '15'},
                          'lcp_100_pourcent': {'name': 'LCP 100%', 'category': 'Politique/Société', 'langue': 'fr', 'number': '223'},
                          'lcp_umts': {'name': 'LCP/PS', 'category': 'Politique/Société', 'langue': 'fr', 'number': '8'},
                          'le_figaro_tv_idf': {'name': 'LE FIGARO TV IDF', 'category': 'Locales', 'langue': 'fr', 'number': '345'},
                          'lmtvsarthe': {'name': 'LMTV SARTHE', 'category': 'Locales', 'langue': 'fr', 'number': '346'},
                          'luckyjack': {'name': 'LUCKY JACK', 'category': 'Divertissement/Jeux', 'langue': 'fr', 'number': '211'},
                          'luxe': {'name': 'LUXE TV', 'category': 'Style de vie/Luxe', 'langue': 'fr', 'number': '215'},
                          'm6_4k': {'name': 'M6 4K', 'category': 'Généraliste/Divertissement', 'langue': 'fr', 'number': '906'},
                          'm6_music': {'name': 'M6MUSIC', 'category': 'Musique', 'langue': 'fr', 'number': '157'},
                          'm6_umts': {'name': 'M6', 'category': 'Généraliste', 'langue': 'fr', 'number': '6'},
                          'maboke_tv': {'name': 'MABOKE TV', 'category': 'Culture africaine', 'langue': 'fr', 'number': '612'},
                          'maison_et_travaux_tv': {'name': 'MAISON ET TRAVAUX TV', 'category': 'Habitat/Décoration', 'langue': 'fr', 'number': '113'},
                          'mandarin_tv': {'name': 'MANDARIN TV', 'category': 'Culture chinoise/Divertissement', 'langue': 'zh', 'number': '549'},
                          'mangas': {'name': 'MANGAS', 'category': 'Animation japonaise', 'langue': 'fr', 'number': '145'},
                          'marmiton_tv': {'name': 'MARMITON TV', 'category': 'Cuisine', 'langue': 'fr', 'number': '117'},
                          'matele': {'name': 'Matélé', 'category': 'Locales', 'langue': 'fr', 'number': '347'},
                          'mbc': {'name': 'MBC', 'category': 'Généraliste', 'langue': 'ar', 'number': '507'},
                          'mbc_5': {'name': 'MBC 5', 'category': 'Généraliste/Maghreb', 'langue': 'ar', 'number': '530'},
                          'mcm': {'name': 'MCM', 'category': 'Musique', 'langue': 'fr', 'number': '139'},
                          'mcmpop': {'name': 'RFM TV', 'category': 'Musique', 'langue': 'fr', 'number': '159'},
                          'medi1tv': {'name': 'MEDI 1 TV', 'category': 'Actualités/Maghreb', 'langue': 'ar', 'number': '242'},
                          'mediaset_italia': {'name': 'MEDIASET ITALIA', 'category': 'Généraliste', 'langue': 'it', 'number': '466'},
                          'melody': {'name': 'MELODY', 'category': 'Musique (rétro)', 'langue': 'fr', 'number': '160'},
                          'melodyafr': {'name': "MELODY D'AFRIQUE", 'category': 'Musique africaine/rétro', 'langue': 'fr', 'number': '153'},
                          'men_s_up': {'name': "MEN'S UP TV", 'category': 'Style de vie/Masculin', 'langue': 'fr', 'number': '216'},
                          'mezzo': {'name': 'MEZZO', 'category': 'Musique classique/Jazz', 'langue': 'fr', 'number': '167'},
                          'mezzolivehd': {'name': 'MEZZO LIVE', 'category': 'Musique classique/Live', 'langue': 'fr', 'number': '168'},
                          'mfm': {'name': 'MADRAS FM TV', 'category': 'Musique/Variété française', 'langue': 'fr', 'number': '399'},
                          'mirabelletv': {'name': 'Moselle TV', 'category': 'Locales', 'langue': 'fr', 'number': '351'},
                          'mtv': {'name': 'MTV', 'category': 'Musique/Divertissement', 'langue': 'en', 'number': '76'},
                          'mtv_hits': {'name': 'MTV HITS', 'category': 'Musique', 'langue': 'en', 'number': '152'},
                          'museum_channel': {'name': 'MUSEUM TV', 'category': 'Art/Culture', 'langue': 'fr', 'number': '112'},
                          'mytv_caraibes': {'name': 'MYTV CARAIBES', 'category': 'Généraliste/Caraïbes', 'langue': 'fr', 'number': '404'},
                          'myzentv': {'name': 'MY ZEN TV', 'category': 'Bien-être/Style de vie', 'langue': 'fr', 'number': '126'},
                          'Natgeo': {'name': 'NATIONAL GEOGRAPHIC', 'category': 'Documentaire', 'langue': 'fr', 'number': '110'},
                          'nci': {'name': 'NCI', 'category': 'Généraliste', 'langue': 'fr', 'number': '599'},
                          'nessma': {'name': 'NESSMA EU', 'category': 'Généraliste/Maghreb', 'langue': 'ar', 'number': '512'},
                          'nhkworld': {'name': 'NHK WORLD - JAPAN', 'category': 'Actualités/Culture japonaise', 'langue': 'en', 'number': '244'},
                          'nickelodeon': {'name': 'NICKELODEON', 'category': 'Jeunesse', 'langue': 'fr', 'number': '100'},
                          'nickelodeon_1': {'name': 'NICKELODEON +1', 'category': 'Jeunesse', 'langue': 'fr', 'number': '101'},
                          'nickelodeon_4teen': {'name': 'NICKELODEON TEEN', 'category': 'Jeunesse/Adolescents', 'langue': 'fr', 'number': '102'},
                          'nickelodeon_junior': {'name': 'NICKELODEON JUNIOR', 'category': 'Jeunesse/Préscolaire', 'langue': 'fr', 'number': '99'},
                          'nollywood_tv': {'name': 'NOLLYWOOD TV', 'category': 'Cinéma africain', 'langue': 'fr', 'number': '608'},
                          'nollywood_tv_epic': {'name': 'NOLLYWOOD TV EPIC', 'category': 'Cinéma africain', 'langue': 'fr', 'number': '611'},
                          'nouvelle_aquitaine': {'name': 'FRANCE 3 NoA', 'category': 'Régionale', 'langue': 'fr', 'number': '326'},
                          'novelas': {'name': 'NOVELAS TV', 'category': 'Séries/Télénovelas', 'langue': 'fr', 'number': '607'},
                          'novo19': {'name': 'Novo19', 'category': 'Généraliste', 'langue': 'fr', 'number': '19'},
                          'nrjhits': {'name': 'NRJ HITS', 'category': 'Musique', 'langue': 'fr', 'number': '151'},
                          'nt1_umts': {'name': 'TFX', 'category': 'Généraliste', 'langue': 'fr', 'number': '11'},
                          'ntdtv': {'name': 'NTD TV', 'category': 'Culture chinoise/Actualités', 'langue': 'zh', 'number': '548'},
                          'numero23': {'name': 'RMC STORY', 'category': 'Divertissement/Société', 'langue': 'fr', 'number': '23'},
                          'olympia_tv': {'name': 'OLYMPIA TV', 'category': 'Musique/Spectacles', 'langue': 'fr', 'number': '166'},
                          'ortb': {'name': 'ORTB', 'category': 'Généraliste', 'langue': 'fr', 'number': '597'},
                          'ortm': {'name': 'ORTM', 'category': 'Généraliste', 'langue': 'fr', 'number': '592'},
                          'panorama_drama': {'name': 'PANORAMA DRAMA', 'category': 'Séries/Drames', 'langue': 'ar', 'number': '528'},
                          'paramount': {'name': 'PARAMOUNT NETWORK', 'category': 'Cinéma', 'langue': 'fr', 'number': '61'},
                          'paramountdec': {'name': 'PARAMOUNT NETWORK DECALE', 'category': 'Cinéma', 'langue': 'fr', 'number': '62'},
                          'parispremiere': {'name': 'PARIS PREMIERE', 'category': 'Divertissement/Culture', 'langue': 'fr', 'number': '36'},
                          'phoenix_cne': {'name': 'PHOENIX CNE', 'category': 'Actualités/Culture chinoise', 'langue': 'zh', 'number': '552'},
                          'phoenix_infonews': {'name': 'PHOENIX INFONEWS', 'category': 'Actualités', 'langue': 'zh', 'number': '553'},
                          'pitchountv': {'name': 'TV PITCHOUN', 'category': 'Jeunesse/Musique', 'langue': 'fr', 'number': '91'},
                          'piwi': {'name': 'PIWI+', 'category': 'Jeunesse/Préscolaire', 'langue': 'fr', 'number': '105'},
                          'planeteplus': {'name': 'PLANETE+', 'category': 'Documentaire', 'langue': 'fr', 'number': '132'},
                          'planeteplus_aventure_experience': {'name': 'PLANETE+AVENTURE', 'category': 'Aventure/Société', 'langue': 'fr', 'number': '134'},
                          'planeteplus_ci': {'name': 'PLANETE+CRIME', 'category': 'Crime/Enquêtes', 'langue': 'fr', 'number': '133'},
                          'polarPlus': {'name': 'POLAR+', 'category': 'Séries/Policier', 'langue': 'fr', 'number': '87'},
                          'public_senat_2424': {'name': 'PUBLIC SENAT 24/24', 'category': 'Politique/Société', 'langue': 'fr', 'number': '224'},
                          'pulaagu': {'name': 'PULAAGU', 'category': "Culture/Afrique de l'Ouest", 'langue': 'ff', 'number': '613'},
                          'rai_due': {'name': 'RAI 2', 'category': 'Généraliste/Divertissement', 'langue': 'it', 'number': '461'},
                          'rai_italia': {'name': 'RAI ITALIA', 'category': 'Généraliste/Italiens à l’étranger', 'langue': 'it', 'number': '465'},
                          'rai_news_24': {'name': 'RAI NEWS 24', 'category': 'Actualités', 'langue': 'it', 'number': '458'},
                          'rai_scuola': {'name': 'RAI SCUOLA', 'category': 'Éducation', 'langue': 'it', 'number': '464'},
                          'rai_storia': {'name': 'RAI STORIA', 'category': 'Histoire/Documentaire', 'langue': 'it', 'number': '463'},
                          'rai_tre': {'name': 'RAI 3', 'category': 'Généraliste/Culture/Info', 'langue': 'it', 'number': '462'},
                          'rai_uno': {'name': 'RAI 1', 'category': 'Généraliste', 'langue': 'it', 'number': '460'},
                          'real_madrid_tv_espagnol': {'name': 'REAL MADRID TV', 'category': 'Sport/Football', 'langue': 'es', 'number': '442'},
                          'recordsnews': {'name': 'RECORD NEWS', 'category': 'Actualités', 'langue': 'pt', 'number': '445'},
                          'rmcdecouverte': {'name': 'RMC DECOUVERTE', 'category': 'Documentaire', 'langue': 'fr', 'number': '24'},
                          'rotana_aflam': {'name': 'ROTANA COMEDY', 'category': 'Cinéma arabe', 'langue': 'ar', 'number': '524'},
                          'rotana_cinema': {'name': 'ROTANA CINEMA', 'category': 'Cinéma', 'langue': 'ar', 'number': '523'},
                          'rotana_classic': {'name': 'ROTANA CLASSIC', 'category': 'Cinéma classique/Musique', 'langue': 'ar', 'number': '508'},
                          'rotana_clip': {'name': 'ROTANA CLIP', 'category': 'Musique', 'langue': 'ar', 'number': '509'},
                          'rotana_drama': {'name': 'ROTANA DRAMA', 'category': 'Séries/Drames', 'langue': 'ar', 'number': '525'},
                          'rotana_khalijia': {'name': 'ROTANA KHALIJIA', 'category': 'Généraliste/Golfe', 'langue': 'ar', 'number': '522'},
                          'rotana_musica': {'name': 'ROTANA MUSICA', 'category': 'Musique arabe', 'langue': 'ar', 'number': '519'},
                          'rtg': {'name': 'RTG', 'category': 'Généraliste', 'langue': 'fr', 'number': '603'},
                          'rti1': {'name': 'RTI1', 'category': 'Généraliste', 'langue': 'fr', 'number': '593'},
                          'rtl9': {'name': 'RTL9', 'category': 'Divertissement/Télé-réalité', 'langue': 'fr ', 'number': '34'},
                          'rtnc': {'name': 'RTNC', 'category': 'Généraliste (Congo)', 'langue': 'fr', 'number': '595'},
                          'rtp3': {'name': 'RTP 3', 'category': 'Actualités', 'langue': 'pt', 'number': '444'},
                          'rtpi': {'name': 'RTPI', 'category': 'Généraliste/Chaîne internationale', 'langue': 'pt', 'number': '443'},
                          'rts': {'name': 'RTS', 'category': 'Généraliste (Sénégal)', 'langue': 'fr', 'number': '590'},
                          'samira_tv': {'name': 'SAMIRA TV', 'category': 'Cuisine/Culture maghrébine', 'langue': 'ar', 'number': '517'},
                          'sen_tv': {'name': 'SEN TV', 'category': 'Généraliste (Sénégal)', 'langue': 'fr', 'number': '610'},
                          'serie_club': {'name': 'SERIE CLUB', 'category': 'Séries', 'langue': 'fr', 'number': '88'},
                          'shanghai_dragon_tv': {'name': 'SHANGHAI DRAGON TV', 'category': 'Généraliste/Chine', 'langue': 'zh', 'number': '557'},
                          'sicinternacional': {'name': 'SIC INTERNACIONAL', 'category': 'Généraliste/Portugal', 'langue': 'pt', 'number': '449'},
                          'sicnoticias': {'name': 'SIC NOTICIAS', 'category': 'Actualités', 'langue': 'pt', 'number': '448'},
                          'skynews': {'name': 'SKYNEWS', 'category': 'Actualités', 'langue': 'en', 'number': '233'},
                          'souvenirsfromearth': {'name': 'SOUVENIRS FROM EARTH', 'category': 'Documentaire/Nature', 'langue': 'fr', 'number': '221'},
                          'sportenfrance': {'name': 'SPORT EN FRANCE', 'category': 'Sport', 'langue': 'fr', 'number': '174'},
                          'sqool_tv': {'name': 'SQOOL TV', 'category': 'Jeunesse/Éducation', 'langue': 'fr', 'number': '217'},
                          'star_tve': {'name': 'STAR TVE', 'category': 'Divertissement/Séries', 'langue': 'es', 'number': '435'},
                          'sunu_yeuf': {'name': 'SUNU YEUF', 'category': 'Culture/Afrique', 'langue': 'fr', 'number': '609'},
                          'syfy': {'name': 'SYFY', 'category': 'Séries', 'langue': 'fr', 'number': '85'},
                          't18': {'name': 'T18', 'category': 'Généraliste', 'langue': 'fr', 'number': '18'},
                          'tamazight': {'name': 'TAMAZIGHT', 'category': 'Culture/Maghreb', 'langue': 'tzm', 'number': '499'},
                          'tcm': {'name': 'TCM CINEMA', 'category': 'Cinéma/Classiques', 'langue': 'fr', 'number': '63'},
                          'tcm_vo': {'name': 'TCM CINEMA (VO)', 'category': 'Cinéma/Classiques', 'langue': 'en', 'number': '413'},
                          'tebeo': {'name': 'Tébéo', 'category': 'Locales', 'langue': 'fr', 'number': '353'},
                          'tele_antilles': {'name': 'TELE ANTILLES', 'category': 'Généraliste/Caraïbes', 'langue': 'fr', 'number': '398'},
                          'tele_congo': {'name': 'TELE CONGO', 'category': 'Généraliste (Congo)', 'langue': 'fr', 'number': '596'},
                          'telegrenobleisere': {'name': 'Télé Grenoble Isère', 'category': 'Locales', 'langue': 'fr', 'number': '348'},
                          'telenantes': {'name': 'TéléNantes', 'category': 'Locales', 'langue': 'fr', 'number': '354'},
                          'teletoon': {'name': 'TELETOON+', 'category': 'Jeunesse', 'langue': 'fr', 'number': '106'},
                          'teletoonplus1': {'name': 'TELETOON +1', 'category': 'Jeunesse', 'langue': 'fr', 'number': '107'},
                          'teva': {'name': 'TEVA', 'category': 'Bien-être/Mode', 'langue': 'fr', 'number': '35'},
                          'tf1': {'name': 'TF1', 'category': 'Généraliste', 'langue': 'fr', 'number': '1'},
                          'TF1_4K': {'name': 'TF1 4K', 'category': 'Généraliste/Haute définition', 'langue': 'fr', 'number': '901'},
                          'tfm': {'name': 'TFM', 'category': 'Généraliste/Afrique', 'langue': 'fr', 'number': '604'},
                          'tgcom24': {'name': 'TGCOM24', 'category': 'Actualités', 'langue': 'it', 'number': '459'},
                          'tiji': {'name': 'TIJI', 'category': 'Jeunesse', 'langue': 'fr', 'number': '97'},
                          'tlc_wbd': {'name': 'TLC', 'category': 'Divertissement/Documentaire', 'langue': 'fr', 'number': '79'},
                          'tmc': {'name': 'TMC', 'category': 'Divertissement/Généraliste', 'langue': 'fr', 'number': '10'},
                          'tn_tv': {'name': 'TAHITI NUI TELEVISION', 'category': 'Généraliste/Séries', 'langue': 'ar', 'number': '396'},
                          'Toonami': {'name': 'WARNER TV NEXT', 'category': 'Jeunesse/Animation', 'langue': 'fr', 'number': '146'},
                          'top_sante_tv': {'name': 'TOP SANTE TV', 'category': 'Santé/Bien-être', 'langue': 'fr', 'number': '114'},
                          'toute_l_histoire': {'name': "TOUTE L'HISTOIRE", 'category': 'Documentaire/Histoire', 'langue': 'fr', 'number': '123'},
                          'trace_africa': {'name': 'TRACE AFRICA', 'category': 'Musique/Culture africaine', 'langue': 'fr', 'number': '605'},
                          'trace_afrikora': {'name': 'TRACE TERANGA', 'category': 'Musique/Afrique', 'langue': 'fr', 'number': '614'},
                          'trace_gospel': {'name': 'TRACE GOSPEL', 'category': 'Musique/Gospel', 'langue': 'fr', 'number': '606'},
                          'trace_latina': {'name': 'TRACE LATINA', 'category': 'Musique/Latino', 'langue': 'fr', 'number': '162'},
                          'trace_tropical': {'name': 'TRACE CARIBBEAN', 'category': 'Musique/Afro-Caribéenne', 'langue': 'fr', 'number': '161'},
                          'trace_urban': {'name': 'TRACE URBAN', 'category': 'Musique/Hip-Hop', 'langue': 'fr', 'number': '150'},
                          'trace_vanilla': {'name': 'TRACE VANILLA', 'category': 'Musique/R&B', 'langue': 'fr', 'number': '163'},
                          'travel_channel': {'name': 'TRAVEL CHANNEL', 'category': 'Voyages/Aventures', 'langue': 'en', 'number': '414'},
                          'trtworld': {'name': 'TRT WORLD', 'category': 'Actualités/International', 'langue': 'tr', 'number': '246'},
                          'tv3_catalunya': {'name': 'TV3 CATALUNYA', 'category': 'Généraliste/Culture', 'langue': 'ca', 'number': '439'},
                          'tv5': {'name': 'TV5MONDE', 'category': 'Généraliste/International', 'langue': 'fr', 'number': '33'},
                          'tv5_television': {'name': 'TV5 TURKEY', 'category': 'Généraliste/Espagne', 'langue': 'es', 'number': '491'},
                          'tv7': {'name': 'TV7', 'category': 'Locales', 'langue': 'fr', 'number': '355'},
                          'tv8montblanc': {'name': '8 MONT-BLANC', 'category': 'Locales', 'langue': 'fr', 'number': '343'},
                          'tv_de_galicia': {'name': 'TV DE GALICIA', 'category': 'Généraliste/Espagne', 'langue': 'gl', 'number': '441'},
                          'tv_kreol': {'name': 'TELE KREOL', 'category': 'Généraliste/Îles Maurice/Réunion', 'langue': 'fr', 'number': '409'},
                          'tv_monaco': {'name': 'TVMONACO', 'category': 'Généraliste/Monaco', 'langue': 'fr', 'number': '412'},
                          'tv_pitchoun_kids_music': {'name': 'TV PITCHOUN KIDS MUSIC', 'category': 'Jeunesse/Musique', 'langue': 'fr', 'number': '149'},
                          'tv_tours_val_de_loire': {'name': 'Val de Loire TV', 'category': 'Locales', 'langue': 'fr', 'number': '361'},
                          'tvbreizh_umts': {'name': 'TV BREIZH', 'category': 'Divertissement/Séries', 'langue': 'fr', 'number': '37'},
                          'tvei': {'name': 'TVE INTERNACIONAL', 'category': 'Culture/Éducation', 'langue': 'pt', 'number': '433'},
                          'tviinternacional': {'name': 'TVI INTERNACIONAL', 'category': 'Généraliste/Portugal', 'langue': 'pt', 'number': '447'},
                          'tvr': {'name': 'TVR', 'category': 'Locales', 'langue': 'fr', 'number': '352'},
                          'tvrecord': {'name': 'TV RECORD', 'category': 'Généraliste/Brésil', 'langue': 'pt', 'number': '450'},
                          'tvri': {'name': 'TVRI', 'category': 'Généraliste/Indonésie', 'langue': 'id', 'number': '488'},
                          'tvt': {'name': 'TVT', 'category': 'Généraliste', 'langue': 'fr', 'number': '602'},
                          'ushuaia': {'name': 'USHUAIA TV', 'category': 'Documentaire/Nature', 'langue': 'fr', 'number': '125'},
                          'viaoccitanie_montpellier': {'name': 'ViàOccitanie Montpellier', 'category': 'Locales', 'langue': 'fr', 'number': '359'},
                          'vosgestv': {'name': 'VOSGES TV', 'category': 'Locales', 'langue': 'fr', 'number': '350'},
                          'voxafrica': {'name': 'VOXAFRICA', 'category': 'Culture/Afrique', 'langue': 'fr', 'number': '587'},
                          'vplus_tvi': {'name': 'V+ TVI', 'category': 'Généraliste/Portugal', 'langue': 'pt', 'number': '451'},
                          'w9': {'name': 'W9', 'category': 'Divertissement/Musique', 'langue': 'fr', 'number': '9'},
                          'warner_tv': {'name': 'Warner TV', 'category': 'Séries', 'langue': 'fr', 'number': '78'},
                          'weo_nord_pas_de_calais': {'name': 'WEO TV La Voix du Nord', 'category': 'Locales', 'langue': 'fr', 'number': '356'},
                          'zhejiang_international_tv': {'name': 'ZHEJIANG INTERNATIONAL TV', 'category': 'Généraliste/Chine', 'langue': 'zh', 'number': '556'},
                          'zitata': {'name': 'ZITATA TV', 'category': 'Musique', 'langue': 'fr', 'number': '403'}};

    const Infos = {
        isListedChannels: function(str) {
            return listedChannels.indexOf(str) != -1;

        },
        addListedChannels: function(str) {
           if (listedChannels.indexOf(str) == -1) {
               listedChannels.push(str);
           }
        },
        getDisplayName: function(str) {
            if (channelsInfo.hasOwnProperty(str) && channelsInfo[str].name != "") {
                return channelsInfo[str].name;
            }
            return str;
        },
        getCategory: function(str) {
            if (channelsInfo.hasOwnProperty(str) && channelsInfo[str].category != "") {
                return channelsInfo[str].category;
            }
            return "Catégorie inconnue";
        },
        getLanguage: function(str) {
            if (channelsInfo.hasOwnProperty(str) && channelsInfo[str].langue != "") {
                return channelsInfo[str].langue;
            }
            return "Langue inconnue";
        },
        isPaid: function(str) {
            return ( paidChannels.hasOwnProperty(str) && paidChannels[str] == true );
        },
        setPaid: function(str) {
            if (!paidChannels.hasOwnProperty(str)) {
                paidChannels[str] = true;
            }
        },
        getNumber: function(str) {
            if (channelsInfo.hasOwnProperty(str) && channelsInfo[str].number != "") {
                return channelsInfo[str].number;
            }
            return "0";
        },
        getChannelsSortedByTrueName: function() {
            const names = {};
            let sortedName = {};
            for (const name in config.channels) {
                names[name] = Infos.getDisplayName(name);
            }
            sortedName = Object.fromEntries(Object.entries(names).sort(function ([,a], [,b]) {
                return a.toLowerCase().localeCompare(b.toLowerCase());
            })
                                           );
            return sortedName;
        },
        getChannelsSortedByNumber: function() {
            const names = {};
            let sortedName = {};
            for (const name in config.channels) {
                names[name] = parseInt(Infos.getNumber(name));
            }
            // Can be improved?
            sortedName = Object.fromEntries(Object.entries(names).sort(function ([,a], [,b]) {
                return a > b;
            })
                                           );
            return sortedName;
        },
    };

    function showToast(message, duration = 3000) {
        const toast = document.createElement('div');
        toast.classList.add("remover-toast");
        toast.textContent = message;
        document.body.appendChild(toast);
        setTimeout(() => {
            toast.style.opacity = '1';
        }, 10);

        setTimeout(() => {
            toast.style.opacity = '0';
            setTimeout(() => document.body.removeChild(toast), 500);
        }, duration);
    };
    function saveConfig() {
        GM_setValue("channels", config.channels);
        GM_setValue("hideIsPaid", config.hideIsPaid);
    };
    function resetConfig() {
        if (confirm("Êtes-vous sûr de vouloir réinitialiser toutes les préférences?")) {
            config.channels = {};
            config.hideIsPaid = false;
            saveConfig();
            showToast("Configuration réinitialisée.", 4000);
            closeDialog();
        }
    };
    function exportConfigToFile() {
        const exportObj = {
            hideIsPaid: config.hideIsPaid,
            channels: {}
        };
        for (const [name, value] of Object.entries(config.channels)) {
                exportObj.channels[name] = value;
        }
        const dataStr = JSON.stringify(exportObj, null, 2);
        const blob = new Blob([dataStr], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "CleanTvOrange_config.json";
        a.click();
        URL.revokeObjectURL(url);
    };
    function openFile(event) {
        let input = event.target;
        let reader = new FileReader();
        reader.onload = function(){
            try {
                let text = reader.result;
                let saved = JSON.parse(text);
                if (saved.hasOwnProperty("channels")) {
                    for (const name in saved.channels) {
                        const value = saved.channels[name];
                        if (typeof value === 'string' && ["0", "1", "2", "3"].includes(value)) {
                            config.channels[name] = value;
                        }
                    };
                }
                if (saved.hasOwnProperty("hideIsPaid")) {
                    config.hideIsPaid = !!saved.hideIsPaid;
                }
                saveConfig();
                closeDialog();
                showToast("Configuration chargée avec succès.");
            } catch (e) {
                console.error(e);
                showToast("Erreur : fichier de configuration invalide ou corrompu.", 5000);
            }
        };
        reader.readAsText(input.files[0]);
    };
    function updateCombo(selectObject) {
        let value = selectObject.target.value;
        let parent = selectObject.target.parentNode;
        parent.classList.remove("remover-color-delete");
        parent.classList.remove("remover-color-normal");
        parent.classList.remove("remover-color-favori1");
        parent.classList.remove("remover-color-favori2");
        if (value == '0') {
            parent.classList.add("remover-color-delete");
        } else if (value == '1') {
            parent.classList.add("remover-color-normal");
        } else if (value == '2') {
            parent.classList.add("remover-color-favori1");
        } else if (value == '3') {
            parent.classList.add("remover-color-favori2");
        }
    };
    function savePreferences() {
        const selectsCollection = document.getElementsByClassName("remover-select");
        const selects = Array.from(selectsCollection);
        selects.forEach(element => {
            let name = element.getAttribute("name");
            let value = element.value;
            config.channels[name] = value;
        });
        const elemHide = document.getElementById('toggle-hide-ispaid');
        if (elemHide != null) {
            config.hideIsPaid = elemHide.checked;
        }
        saveConfig();
    };
    function closeDialog() {
        let old = document.getElementById('remover-div-overlay');
        if (old) {
            old.remove();
        }
    };
    function closeDialogAndSave() {
        savePreferences();
        closeDialog();
    };
    function showConfigManager() {
        const existing = document.getElementById("config-manager");
        if (existing) {
            existing.remove();
        }
        const html = `<div id="config-manager">
                <div class="config-box">
                    <h3>Gestion de la configuration</h3>
                       <div><input type="file" id="config-import" accept=".json,.txt" style="display:none;">
                        <div><button id="config-btn-import">📂 Charger</button></div>
                        <div><button id="config-btn-export">💾 Sauvegarder</button></div>
                        <div><button id="config-btn-reset">♻️ Réinitialiser</button></div>
                        <div><button id="config-btn-close">✖ Fermer</button></div>
                </div>
            </div>`;
        document.body.insertAdjacentHTML("beforeend", html);
        document.getElementById("config-btn-close").addEventListener("click", () => {
            document.getElementById("config-manager").remove();
        });
        document.getElementById("config-btn-export").addEventListener("click", exportConfigToFile);
        document.getElementById("config-btn-reset").addEventListener("click", resetConfig);
        document.getElementById("config-btn-import").addEventListener("click", () => {
            document.getElementById("config-import").click();
        });
        document.getElementById("config-import").addEventListener("change", openFile);
    };



    function displayConfig() {
        closeDialog();
        let dialogHTML = `<div id="remover-div-overlay" >
            <div id="remover-div-prefs" >
                <div class="remover-div-title">
                    <h3>Chaines gratuites</h3>
                </div>
                <div class="remover-div-mosaic">`;
        let freeHTML = ``;
        let paidHTML = ``;
        //const sortedName = Infos.getChannelsSortedByTrueName();
        const sortedName = Infos.getChannelsSortedByNumber();
        for (const name in sortedName) {
            if (!Infos.isListedChannels(name)){ continue; } //don't display no listed channel

            let language = Infos.getLanguage(name);
            let category = Infos.getCategory(name);
            let number = Infos.getNumber(name);
            let optionsHTML = ``;
            for (const opt in options) {
                if (options[opt] == config.channels[name] ) {
                    optionsHTML += `<option selected value="${options[opt]}" >${opt}</option>`;
                } else {
                    optionsHTML += `<option value="${options[opt]}" >${opt}</option>`;
                }
            };
            let channelHTML = `<div class="remover-div-channel" >
                <label for="${name}" class="remover-label-channels">${number}. ${Infos.getDisplayName(name)}</label>
                <span class="remover-label-channels" >${category}</span>
                <span class="remover-label-channels" >${language}</span>
                <select class="remover-select" name="${name}" id="${name}" >
                    ${optionsHTML}
                </select></div>`;
            if (!Infos.isPaid(name)) {
                freeHTML += channelHTML;
            } else {
                paidHTML += channelHTML;
            }
        };

        dialogHTML += freeHTML;
        dialogHTML += `</div>
            <div class="remover-div-title"><h3>Chaines payantes</h3></div>
            <div class="remover-div-mosaic">`;
        dialogHTML += paidHTML;
        dialogHTML += `</div>
            </div>
            <div class="remover-div-menu">`;
        dialogHTML += `<div><label for="toggle-hide-ispaid"> Cacher payantes</label>`;
        if (config.hideIsPaid == true) {
            dialogHTML += `<input type="checkbox" id="toggle-hide-ispaid" checked />`;
        } else {
            dialogHTML += `<input type="checkbox" id="toggle-hide-ispaid" />`;
        }
        dialogHTML += `<button type="button" class="remover-button" id="save-prefs">Ok</button>
                </div>
            </div>
        </div>`;

        document.body.insertAdjacentHTML('beforeend', dialogHTML);
        document.getElementById('save-prefs').addEventListener('click', closeDialogAndSave);

        const selectsCollection = document.getElementsByClassName("remover-select");
        const selects = Array.from(selectsCollection);
        selects.forEach(element => {
            element.addEventListener('change', updateCombo);
            let value = element.value;
            let parent = element.parentNode;
            parent.classList.remove("remover-color-delete");
            parent.classList.remove("remover-color-favori1");
            parent.classList.remove("remover-color-favori2");
            parent.classList.remove("remover-color-normal");
            if (value == '0') {
                parent.classList.add("remover-color-delete");
            } else if (value == '1') {
                parent.classList.add("remover-color-normal");
            } else if (value == '2') {
                parent.classList.add("remover-color-favori1");
            } else if (value == '3') {
                parent.classList.add("remover-color-favori2");
            }
        });
    };

    function sortChannels() {
        const mosaic = document.getElementById("mosaic");
        if (mosaic == null) { return; }

        // fav2 first, don't invert order
        let favMosaic2 = document.getElementById("favMosaic2");
        if (favMosaic2 == null) {
            favMosaic2 = document.createElement('ul');
            favMosaic2.id = 'favMosaic2';
            let mosaicAttributeNames = mosaic.getAttributeNames();
            mosaicAttributeNames.forEach(element => {
                if (element != "id") {
                    let att = mosaic.getAttribute(element);
                    favMosaic2.setAttribute(element, att);
                }
            });
            mosaic.parentElement.insertBefore(favMosaic2, mosaic);
        }
        let favMosaic1 = document.getElementById("favMosaic1");
        if (favMosaic1 == null) {
            favMosaic1 = document.createElement('ul');
            favMosaic1.id = 'favMosaic1';
            let mosaicAttributeNames = mosaic.getAttributeNames();
            mosaicAttributeNames.forEach(element => {
                if (element != "id") {
                    let att = mosaic.getAttribute(element);
                    favMosaic1.setAttribute(element, att);
                }
            });
            mosaic.parentElement.insertBefore(favMosaic1, favMosaic2);
        }
        const childrenArray = Array.from(mosaic.children);
        childrenArray.forEach(child => {
            if (child.tagName == "LI" ) {
                let a = child.querySelectorAll('a')[0];
                if (a != null) {
                    let name = a.href.split("/livetv_",2)[1];
                    Infos.addListedChannels(name);
                    let isPaid = a.href.search("/boutique/") != -1;
                    if (isPaid) {
                        Infos.setPaid(name);
                    }
                    let value = "1";
                    if (config.channels.hasOwnProperty(name) && config.channels[name] != null) {
                         value = config.channels[name];
                    } else {
                         config.channels[name] = value;
                    }

                    let dname = Infos.getDisplayName(name)
                    let category = Infos.getCategory(name);
                    let language = Infos.getLanguage(name);
                    let number = Infos.getNumber(name);

                    // add a tooltips on channel
                    let h = child.querySelectorAll('h3')[0].innerText;
                    if (!h) {
                        h = "";
                    }
                    let text =`${number}. ${dname}\n${category}\nlangue:${language}\n_____________________________________________\n${h}`;
                    a.title=text;
                    if (value == "2") {
                         favMosaic1.appendChild(child);
                    } else if (value == "3") {
                         favMosaic2.appendChild(child);
                    } else if ( (isPaid && config.hideIsPaid) || value == "0") {
                         child.remove();
                    }
                 }
            }
        });

        //remove empty to hide blue/green square
        if (favMosaic1.childElementCount == 0) {
            favMosaic1.remove();
        }
        if (favMosaic2.childElementCount == 0) {
            favMosaic2.remove();
        }
    };
    function restoreVolume() {
        let volume = config.volume;
        const slider = document.getElementsByClassName('slider')[0];
        if (slider) {
            slider.value = volume;
            var evt = document.createEvent("HTMLEvents");
            evt.initEvent("input", false, true);
            slider.dispatchEvent(evt);
            slider.addEventListener('change', () => {
                config.volume = slider.value;
                GM_setValue("volume", config.volume);
            });
        }
    };
    function afterLoading(){
        let url = window.location.href;
        if (url.search("en-direct/programmes-en-cours") != -1) {
            setTimeout(sortChannels, 1000);
        } else if (url.search("/lecture/") != -1) {
            setTimeout(restoreVolume, 500);
        }
    };

    if (window.onurlchange === null) {
        // feature is supported
        window.addEventListener('urlchange', function () {
            setTimeout(afterLoading, 1000);
        });
    } else {
        document.addEventListener("load", afterLoading);
        window.addEventListener("popstate", afterLoading);
        window.addEventListener("pageshow", afterLoading);
        window.addEventListener("pagehide", afterLoading);
    }
    GM_addStyle(`
        #favMosaic1 {
            border: 1px solid rgb(100, 255, 0);
            margin-top: 10px;
            margin-bottom: 10px;
            padding-top: 10px;
            padding-bottom: 10px;
        }
        #favMosaic2 {
            border: 1px solid rgb(50, 100, 255);
            margin-top: 10px;
            margin-bottom: 10px;
            padding-top: 10px;
            padding-bottom: 10px;
        }
        #remover-div-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.9);
            z-index: 999;
        }
        #remover-div-prefs {
            position: fixed;
            top: 10px;
            width:95%;
            left: 50%;
            transform: translateX(-50%);
            bottom:80px;
            padding: 10px;
            overflow-y: scroll;
            background: black;
            border: 1px solid #ccc;
        }
        .remover-div-title {
            display: flex;
            justify-content: center;
        }
        .remover-div-mosaic {
            display: flex;
            flex-direction: row;
            flex-wrap : wrap;
            justify-content: center;
            margin: 5px;
        }
        .remover-div-channel {
            display: flex;
            flex-direction: column;
            justify-content: center;
            box-sizing: border-box;
            margin: 10px;
            padding: 3px;
            min-width:270px;
            min-height: 120px;
        }
        .remover-div-menu {
            position: fixed;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            display: flex;
            flex-direction: row;
            justify-content: center;
            align-items: center;
            padding: 5px;
        }
        .remover-div-menu label {
            margin: 0;
        }
        .remover-div-menu input {
            margin: 10px;
        }
        .remover-button {
            background: revert;
            color: initial;
            padding: 10px;
            min-width: 120px;
            border-radius: 6px;
            cursor: pointer;
            border: none;
            margin-left: 20px;
        }
        .remover-button:hover {
            background: #666;
        }
        .remover-select {
            margin-left: auto;
            margin-right: auto;
            width: 90%;
            padding: 2px;
        }
        .remover-label-channels {
            text-align: center;
            padding: 1px;
        }
        .remover-color-normal {
            background-color: rgba(65, 65, 65, 0.8);
        }
        .remover-color-delete {
            background-color: rgba(255, 0, 0, 0.8);
        }
        .remover-color-favori1 {
            background-color: rgba(100, 255, 0, 0.8);
        }
        .remover-color-favori2 {
            background-color: rgba(50, 100, 255, 0.8);
        }
        #config-manager {
            position: fixed;
            top: 30%;
            left: 50%;
            transform: translateX(-50%);
            z-index: 9999;
            background: rgba(0, 0, 0, 1);
            padding: 20px;
            border-radius: 10px;
            border: 1px solid #888;
            box-shadow: 0 4px 10px rgba(0,0,0,0.4);
            color: white;
            width: 400px;
        }
        .config-box {
            display: flex;
            flex-direction: column;
            flex-wrap: nowrap;
            align-items: center;
        }
        .config-box button {
            background: revert;
            color: initial;
            padding: 10px;
            min-width: 120px;
            border-radius: 6px;
            cursor: pointer;
            border: none;
            margin: 20px;
        }
        .config-box button:hover {
            background: #666;
        }
        .remover-toast {
            position: fixed;
            top: 10px;
            right: 0%;
            transform: translateX(-50%);
            background-color: rgba(0, 0, 0, 1);
            color: #fff;
            padding: 10px 20px;
            border: solid 0.3em;
            border-radius: 6px;
            border-color: green;
            font-size: 14px;
            z-index: 9999;
            box-shadow: 0 2px 6px rgba(0,0,0,0.3);
            transition: opacity 0.5s ease;
            opacity: 0;
        }
    `);
    GM_registerMenuCommand("Paramètres", displayConfig);
    GM_registerMenuCommand("Config (Charger/Sauvegarder/Reset)", showConfigManager);
})();
