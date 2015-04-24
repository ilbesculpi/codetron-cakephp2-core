<?php

App::uses('Model', 'Model');

class AppModel extends Model {
	
	public $actsAs = array('Containable');
	
	public function proxy( $proxy = array() ) {
        
        $model = array();
        
		$schema = $this->schema();
        
		foreach($schema as $key => $value) {
			if( isset($proxy[$this->alias][$key]) ) {
				$model[$this->alias][$key] = isset($proxy[$this->alias][$key]) ? $proxy[$this->alias][$key] : $value['default'];
			}
			else {
				$model[$this->alias][$key] = isset($proxy[$key]) ? $proxy[$key] : $value['default'];
			}
		}
        
		// relations
		if( $this->hasOne ) {
			foreach($this->hasOne as $alias => $related) {
				$model[$alias] = array();
			}
		}
        
		if( $this->hasMany ) {
			foreach($this->hasMany as $alias => $related) {
				$model[$alias] = array();
			}
		}
        
		if( $this->belongsTo ) {
			foreach($this->belongsTo as $alias => $related) {
				$model[$alias] = array();
			}
		}
        
		if( $this->hasAndBelongsToMany ) {
			foreach($this->hasAndBelongsToMany as $alias => $related) {
				$model[$alias] = array();
			}
		}
        
		return $model;
	}
	
	public function formatName($name, $file) {
		$filename = strtolower(trim($this->data[$this->alias]['name']));
		return Inflector::slug($filename, '-');
	}
	
}
