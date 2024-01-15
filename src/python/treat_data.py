import pandas as pd
import ast
import json
import numpy as np

dico_titu = {'011101': 'Pedagogia', '011201': 'Educació infantil', '011301':	'Educació primària', '011401':	'Altres mestres',
 '011901':	'Educació social', '021101': 'Audiovisual, imatge i multimèdia', '021201': 'Disseni', '021301':	'Belles arts',
 '021302':	'Història de l\'art', '021401': 'Conservació i restauració', '021502':'Música i Arts escéniques', '022201': 'Arqueologia', 
 '022202': 'Història', '022301': 'Filosofia', '022901': 'Humanitats', '023101':	'Llengua anglesa', '023102': 'Llengües clásiques', 
 '023103':	'Altres Llengües extrangeres', '023104': 'Traducció i interpretació', '023201': 'Llengües i dialectes espanyols',
 '023202':	'Literatura', '023901': 'Llengües modernes i aplicades', '031101': 'Economia', '031201':	'Política i gestió pública',
 '031202':	'Relacions internacionals', '031301':	'Psicologia',  '031401':	'Antropología social i cultural',
 '031402':	'Criminologia', '031404':	'Geografia', '031406':	'Sociologia i Igualtat de gènere', '032101': 'Comunicació', '032102':	'Periodisme',
 '032201':	'Informació i documentació', '041201':	'Financera i actuarial', '041202': 'Finances i comptabilitat', 
 '041301':	'Administració i empresa', '041302': 'Ciències del treball', '041303': 'Gestió i administració pública', '041401':'Marqueting',
 '041402':	'Protocol i events', '041403':	'Publicitat i relacions públiques', '041601':	'Comerç', '042101': 'Dret', '051101':	'Biologia',
 '051201':	'Bioquímica', '051202': 'Biotecnologia', '051901': 'Biomedecina', '052101':	'Ciències ambientals', '053101': 'Química', '053201': 'Ciències del mar',
 '053202':	'Geografía i ordenació del territori', '053203': 'Geologia', '053301': 'Física', '054101': 'Matemàtiques', '54201': 'Estadística', 
 '061301':	'Eng. multimèdia', '061901': 'Informàtica', '071101':	'Eng. química industrial/medioambiental',
 '071301':	'Eng. de l\'energía', '071302': 'Eng. elèctrica', '071401':'Eng. de computadores', '071402':	'Eng. d\'imatge i so', '071403': 'Eng. de telecomunicació',
 '071404':	'Eng. electrónica industrial i automàtica', '071405':	'Eng. en electrónica', '071501':	'Eng. en disseny industrial',
 '071502':	'Eng. en tecnologies industrials', '071503': 'Eng. mecànica', '071601': 'Eng. aeronàutica', '071603': 'Eng. naval i oceànica', 
 '071901':	'Eng. d\'organ. industrial i Nanotecnología', '072101': 'Eng. alimentària', '072102': 'Enologia',
 '072201':	'Eng. de materials i Eng. textil', '072401':	'Eng. de mines i energia', '073101': 'Arquitectura, Urbanisme i paisatgisme',
 '073102':	'Eng. geomàtica, topografia i cartografia', '073201':	'Arquitectura tècnica', '073202':	'Eng. civil', '081102': 'Eng. agrària i agroalimentària',
 '081103':	'Eng. agrícola, agropecuària i medi rural', '081201':	'Eng. horticultura i jardineria', '082101': 'Eng. forestal', '084101':'Veterinària', 
 '091101':	'Odontologia', '091201': 'Medicina', '091301': 'Infermeria', '091401': 'Eng. biomèdica i de la salut', '091402': 'Òptica i optometria', 
 '091501':	'Fisioteràpia', '091502':	'Logopèdia', '091503':	'Nutrició humana i dietètica', '091504': 'Podologia',  '091505': 'Teràpia ocupacional',  '091601': 'Farmàcia',
 '092301':	'Treball social', '101401': 'Activitat física i de l\'esport', '101501': 'Turisme', '104101': 'Nàutica i transport marítim', 
 '104103': 'Servei de transport terrestre i aeri', '109999': 'Serveis'}


dico_ambit = { '0112':	'Formació de docents d\'ensenyament infantil', '0113': 'Formació de docents d\'ensenyament primari',
'011':	'Educació (Altres estudis)', '0211': 'Tècniques audiov. i mitjans comunicació', '021': 'Arts (Altres estudis)', 
'022':	'Humanitats', '023': 'Llengües', '0311': 'Economia', '0313': 'Psicologia', '031': 'Ciències socials i del comportament',
'032':	'Periodisme i documentació', '0413': 'Direcció i administració', '041': 'Negocis i administració (Altres estudis)',
'042':	'Dret', '051':	'Ciències de la vida', '052': 'Medi ambient', '053': 'Ciències químiques, físiques i geològiques',
'054':	'Matemàtiques i estadística', '061': 'Informàtica', '071': 'Enginyeria i professions afins', '072': 'Indústria manufacturera i producció',
'073':	'Arquitectura i construcció', '081': 'Agricultura i ramaderia', '082': 'Silvicultura', '084': 'Veterinària', '0912': 'Medicina',
'0913': 'Infermeria', '091': 'Salut (Altres estudis)', '092': 'Serveis socials', '1014': 'Activitats físiques i esportives',
'1015': 'Viatges, turisme i lleure', '109': 'Serveis (Altres estudis)', '9999': 'NS/NC'}

dic_pnaix = {'1': 'ES', '2': 'UE', '3':'EXT UE', '9':'NS/NC'}

dico_nivestudis = { '1':	'No llegeix/escriu', '2':	'<5 anys de primaria', '3': 'Primaria completa', '4': 'ESO, EGB, Batx Elemental', 
                    '5':	'Batx. LOGSE, BUP, COU, Preu', '6': 'Cicle grau mig', '7':	'Cicle grau superior', '8': 'Diplomatura, Llicenciatura, Doctorat', '9': 'NS/NC'}

dico_sino = {'1': 'Sí', '2': 'No', '9': 'NS/NC'}

dico_beca = {'1': 'Erasmus', '2':	'Beca UE', '3': 'Beca EXT UE', '9': 'NS/NC'}

dico_desti = {'01': 'UK', '02': 'GER', '03': 'FR', '04': 'IT', '05': 'POR', '06':'PN', '07':'UE', '08':'EXT_UE', '11': 'NDAM', 
              '12': 'SDAM', '21': 'AS', '31': 'AF', '41': 'OC', '99': 'NS/NC'}

dico_resi = dict(dico_desti, **{'88': 'Cap'})

dico_num_3 = {'1':'Un', '2': 'Dos', '3': '>=Tres'}

dico_num_5 = {'0': 'Cap', '1':'Un', '2': 'Dos', '3': 'Tres', '4': 'Quatre', '5': '>=Cinc', '9': 'NS/NC'}


dico_estcrs = {'01' :'Grau univ. 3a', '02':'Grau univ. 4a', '03': 'Grau univ. 5a', '04': 'Màster univ.', '05':	'Doctorat univ.', '06': 'Artístic sup.',
               '07': 'Cicle grau superior', '08': 'Cicle grau mig', '09': 'Cap dels altres', '99': 'NS/NC'}

dico_llengua = {'01': 'Es', '02': 'Cat', '03': 'Eus', '04':	'Gal', '05': 'Val', '06': 'En', '07': 'Fr', '08': 'De', '09':'It', '10': 'Por', '11': 'Rum', 
                '12': 'Àrab', '13': 'Xinès', '14': 'Rus', '15': 'Altres', '99': 'NS/NC'}

dico_nivell = { '1': 'Bàsic', '2': 'Mig', '3': 'Avançat', '9':'NS/NC'}

dico_decisio = {'1' : 'Sí, marxa en mesos', '2': 'Sí, voldria marxar d\'Esp', '3': 'Sí, voldria però no marxa', '4': 'No, no ho ha pensat', '9': 'NS/NC'}

columns_2_select = ["SEXO", "EDAD", "NACIO", "NACIO1", "NACIO2", "PAIS_NACI", "TITU", "RAMA", "AMBITO", "T_UNIV",
                    "LUG_RES_PAIS", "PAIS_NAC_PADRE", "ESTUDIOS_PADRE", "PAIS_NAC_MADRE", "ESTUDIOS_MADRE",
                    "EST_B1", "EST_B2_1", "EST_B2_2", "EST_B2_3", "EST_B2_4", "EST_B2_5", "EST_M1", "EST_M2", "EST_M3", "EST_M4",
                    "EST_B11_1", "EST_B11_2", "EST_B11_3", "EST_B11_4", "EST_B11_5", "EST_B11_6", "EST_B11_7", "EST_B12", "EST_B16",	"EST_B24",
                    "EST2_NC", "IDI_MT1", "IDI_MT2", "IDIOMAS", "TIC", "MVFUERA", "MOVPAI1", "MOVPAI2", "MOVPAI3", "MOVRA21", "MOVRA22",
                    "MOVRA23", "MOVRA24", "MOVRA25", "MOVRA26", "MOV_C7", "MOV_C8_1", "MOV_C8_2", "MOV_C8_3", "MOV_C8_4", "MOV_C8_5", 
                    "MOV_C8_6", "MOV_C9", "RETORNO"]


class GraduatesStat:
    def __init__(self):
        self.total_surveyed = 0
        self.total_moved = 0
        self.moved_x_zones = dict()
        self.genders = dict()
        self.ages = dict()
        self.ambits = dict()
        self.titus = dict()
        self.total_granted = 0
        self.grants = dict()

if __name__=="__main__":
    
    stats = GraduatesStat()

    df = pd.read_csv('assets/data/EILU_GRAD_2019.csv', sep='\t', dtype='category',
                      converters={'AMBITO': str.strip},  low_memory=False) 
    
    # total estudiants entrevistats
    stats.total_surveyed = df['MVFUERA'].size

    # total estudiants que viuen fora
    df = df[df['MVFUERA'] == '1']
    stats.total_moved = df['MVFUERA'].size

    graduates_df = pd.DataFrame(columns=columns_2_select, dtype='category')

    graduates_df['SEXO'] = df['SEXO'].cat.rename_categories({'1': 'Home', '2': 'Dona'})
    graduates_df['EDAD'] = df['EDAD'].cat.rename_categories({'1': '< 30a', '2': "30a- 34a", '3': '> 35a'})
    graduates_df['NACIO'] = df['NACIO'].cat.rename_categories({'1': 'ES', '2': "ES+", '3': 'ALTRA'})
    graduates_df['NACIO1'] = df['NACIO1'].cat.rename_categories({'1': 'UE', '2': 'EXT UE', '9':'NS/NC'})
    graduates_df['NACIO2'] = df['NACIO2'].cat.rename_categories({'1': 'UE', '2': 'EXT UE', '9':'NS/NC'})
    graduates_df['PAIS_NACI'] = df['PAIS_NACI'].cat.rename_categories(dic_pnaix)
    graduates_df['TITU'] = df['TITU'].cat.rename_categories(dico_titu)
    graduates_df['RAMA'] = df['RAMA'].cat.rename_categories({'1': 'Arts/human', '2': 'Ciències', '3': 'C.Socials/jurídiques', 
                                                             '4': 'Enginieria/arquitectura', '5': 'C. Salut'})
    graduates_df['AMBITO'] = df['AMBITO'].astype('category').cat.rename_categories(dico_ambit) 
    graduates_df['T_UNIV'] = df['T_UNIV'].cat.rename_categories({ '1' : 'Púb. presencial', '2' : 'Púb. a distancia', 
                                                                  '3' : 'Priv. presencial', '4' : 'Priv. a distancia'})
    graduates_df['LUG_RES_PAIS'] = df['LUG_RES_PAIS'].cat.rename_categories({'01' :'ES', '02': 'UK', '03': 'GER',
                                                                             '04': 'FR', '05': 'altre (UE)', '06': 'altre (EXT UE)', 
                                                                             '07': 'Nordamèrica', '08': 'Sudamèrica/Centreamèrica',
                                                                             '09': 'Àsia', '10': 'Àfrica', '11': 'Oceanía', '99': 'NS/NC'})


    graduates_df['PAIS_NAC_PADRE'] = df['PAIS_NAC_PADRE'].cat.rename_categories(dic_pnaix)
    graduates_df['ESTUDIOS_PADRE'] = df['ESTUDIOS_PADRE'].cat.rename_categories(dico_nivestudis)
    graduates_df['PAIS_NAC_MADRE'] = df['PAIS_NAC_MADRE'].cat.rename_categories(dic_pnaix)
    graduates_df['ESTUDIOS_MADRE'] =  df['ESTUDIOS_MADRE'].cat.rename_categories(dico_nivestudis)
    graduates_df['EST_B1'] = df['EST_B1'].cat.rename_categories(dico_sino)
    graduates_df['EST_B2_1'] = df['EST_B2_1'].cat.rename_categories(dico_sino)
    graduates_df['EST_B2_2'] = df['EST_B2_2'].cat.rename_categories(dico_sino)
    graduates_df['EST_B2_3'] = df['EST_B2_3'].cat.rename_categories(dico_sino)
    graduates_df['EST_B2_4'] = df['EST_B2_4'].cat.rename_categories(dico_sino)
    graduates_df['EST_B2_5'] = df['EST_B2_5'].cat.rename_categories(dico_sino)  
    graduates_df['EST_M1'] = df['EST_M1'].cat.rename_categories(dico_sino)
    graduates_df['EST_M2'] = df['EST_M2'].cat.rename_categories(dico_beca)
    graduates_df['EST_M3'] = df['EST_M3'].cat.rename_categories(dico_desti)
    graduates_df['EST_M4'] = df['EST_M4'].cat.rename_categories(dico_beca)
    graduates_df['EST_B11_1'] = df['EST_B11_1'].cat.rename_categories(dico_sino)
    graduates_df['EST_B11_2'] = df['EST_B11_2'].cat.rename_categories(dico_sino)
    graduates_df['EST_B11_3'] = df['EST_B11_3'].cat.rename_categories(dico_sino)
    graduates_df['EST_B11_4'] = df['EST_B11_4'].cat.rename_categories(dico_sino)
    graduates_df['EST_B11_5'] = df['EST_B11_5'].cat.rename_categories(dico_sino)
    graduates_df['EST_B11_6'] = df['EST_B11_6'].cat.rename_categories(dico_sino)
    graduates_df['EST_B11_7'] = df['EST_B11_7'].cat.rename_categories(dico_sino)
    graduates_df['EST_B12'] = df['EST_B12'].cat.rename_categories(dico_num_3)
    graduates_df['EST_B16'] = df['EST_B16'].cat.rename_categories(dico_num_3)
    graduates_df['EST_B24'] = df['EST_B24'].cat.rename_categories(dico_num_3)
    graduates_df['EST2_NC'] = df['EST2_NC'].cat.rename_categories(dico_estcrs)
    graduates_df['IDI_MT1'] = df['IDI_MT1'].cat.rename_categories(dico_llengua)
    graduates_df['IDI_MT2'] = df['IDI_MT2'].cat.rename_categories(dico_llengua)
    graduates_df['IDIOMAS'] = df['IDIOMAS'].cat.rename_categories(dico_num_5)
    graduates_df['TIC'] = df['TIC'].cat.rename_categories(dico_nivell)
    graduates_df['MVFUERA'] = df['MVFUERA'].cat.rename_categories(dico_sino)
    graduates_df['MOVPAI1'] = df['MOVPAI1'].cat.rename_categories(dico_resi)
    graduates_df['MOVPAI2'] = df['MOVPAI2'].cat.rename_categories(dico_resi)
    graduates_df['MOVPAI3'] = df['MOVPAI3'].cat.rename_categories(dico_resi)
    graduates_df['MOVRA21'] = df['MOVRA21'].cat.rename_categories(dico_sino)
    graduates_df['MOVRA22'] = df['MOVRA22'].cat.rename_categories(dico_sino)
    graduates_df['MOVRA23'] = df['MOVRA23'].cat.rename_categories(dico_sino)
    graduates_df['MOVRA24'] = df['MOVRA24'].cat.rename_categories(dico_sino)
    graduates_df['MOVRA25'] = df['MOVRA25'].cat.rename_categories(dico_sino)
    graduates_df['MOVRA26'] = df['MOVRA26'].cat.rename_categories(dico_sino)
    graduates_df['MOV_C7'] = df['MOV_C7'].cat.rename_categories(dico_decisio)
    graduates_df['MOV_C8_1'] = df['MOV_C8_1'].cat.rename_categories(dico_sino)
    graduates_df['MOV_C8_2'] = df['MOV_C8_2'].cat.rename_categories(dico_sino)
    graduates_df['MOV_C8_3'] = df['MOV_C8_3'].cat.rename_categories(dico_sino)
    graduates_df['MOV_C8_4'] = df['MOV_C8_4'].cat.rename_categories(dico_sino)
    graduates_df['MOV_C8_5'] = df['MOV_C8_5'].cat.rename_categories(dico_sino)
    graduates_df['MOV_C8_6'] = df['MOV_C8_6'].cat.rename_categories(dico_sino)
    graduates_df['MOV_C9'] = df['MOV_C9'].cat.rename_categories(dico_resi)
    graduates_df['RETORNO'] = df['RETORNO'].cat.rename_categories(dico_sino)

    # països als quals viuen
    stats.moved_x_zones = graduates_df['MOVPAI1'].value_counts().to_dict()

    # gènere
    stats.genders = graduates_df['SEXO'].value_counts().to_dict()

    # edats
    stats.ages = graduates_df['EDAD'].value_counts().to_dict()

    # àmbits
    stats.ambits = graduates_df['AMBITO'].value_counts().to_dict()

    # titulacions
    for key, value in graduates_df['TITU'].value_counts().to_dict().items():
        if value >= 10:
            stats.titus[key] = value


    # Filtra tots aquells estudiants amb beca
    graduates_df = graduates_df[graduates_df['EST_B1'] == 'Sí']

    stats.total_granted = graduates_df['MVFUERA'].size
    stats.grants['Beca general estudi'] = graduates_df['EST_B2_1'].value_counts().to_dict()['Sí']
    stats.grants['Beca excelència'] =     graduates_df['EST_B2_2'].value_counts().to_dict()['Sí']
    stats.grants['Beca col·laboració universitat'] = graduates_df['EST_B2_3'].value_counts().to_dict()['Sí']
    stats.grants['Beca pràctiques externes'] = graduates_df['EST_B2_4'].value_counts().to_dict()['Sí']
    stats.grants['Beca per estudis estranger'] = graduates_df['EST_B2_5'].value_counts().to_dict()['Sí']

    # graduates = graduates_df.to_json(orient="index")
    # parsed = json.loads(graduates)
    # data = json.dumps(parsed, indent=4, ensure_ascii=False)

    with open('graduates_mobility.json', 'w', encoding='utf-8') as f:
        data = json.dumps(stats, default = lambda x: x.__dict__)
        json.dump(data, f, ensure_ascii=False, indent=4)
        f.close()