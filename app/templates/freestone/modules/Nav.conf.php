<?PHP

	$this->tableNav = 'page';
	
	$this->idRoot = 1;//Niveau de base (non montré dans le menu) dont tous les éléments du menu sont des childs
	
	//indique que dans le menu principal, les éléments du niveau x sont montrés, et uniquement pour l'item actif
	$this->mainMenuRootLevel = 0;
	
	self::$maxLevels = 3;
	
	//liste des champs utilisés
	$this->fields = array(
		'label' => 'menuLabel_'.VWebsite::$lang,//label du menu
		'pk' => 'id',//primary key de la table
		'link_parent' => 'parent',
		'urlExt' => 'externalURL',//url externe
		'secure' => '"0"',
		'extTab' => 'externalTable',//ch table extenre
		'extPK' => 'externalPK',//ch contenant le nom du PK d'un level externe
		'extClauses' => 'externalClauses',//ch contenant les clauses sql du select d'un level externe
		'extOrder' => 'externalOrder',//ch ordre quand table externe
		'extTemplate' => '`externalTemplate`',
		'boolAgglo' => 'externalGrouped',//indique si les recs externes sont agglomérés en un seul item au menu
		'order' => '`order`',//champ ordre
		'isChildDefault'=>'isChildDefault',//indique que cette page montre son premier child plutot qu'elle même dans le menu
		'cssId'=>'cssId',
	);
		
	
	class NavHooks {
				
	}