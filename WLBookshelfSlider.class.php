<?php
/* 
   This singleton class contains all the logic for the WL Bookshelf Slider plugin - mostly just a shortcode and some javascript.
   This will load a flexslider slide for a shortcode of the form [bookslider firstname='' lastname=''] where firstname/lastname
   is the name of a norwegian author. This will retreive the books of this author from Nasjonalbiblioteket and produce the slider.
 */

class WLBookshelfSlider {
    public $settings= array();
    protected static $instance = null;

    function __construct() {
        $this->settings = get_option('wl-bookshelf-slider_options', array());
    }

    // This class should only get instantiated with this method. IOK 2019-10-14 
    public static function instance()  {
        if (!static::$instance) static::$instance = new static();
        return static::$instance;
    }

    private function translation_dummy () {
        print __('Dynamic string', 'wl-bookshelf-slider');
    }

    public function init () {
        $this->enqueue_scripts();
        $this->add_shortcodes();
    }

    function add_shortcodes() {

        add_shortcode('bookslider', function ($args, $content='') {
                $atts = shortcode_atts(array('firstname'=>'','lastname'=>''),$args,'bookslider');
                $authorName = $atts['lastname'];
                $namedata = '';
                if ($authorName && $atts['firstname']) {
                $authorName .= "  " . $atts['firstname'];
                }
                if ($authorName) {
                $namedata = " data-author='" . esc_attr($authorName) . "' ";
                }
                return "<div class='author-page-related-book wl-bookshelf-slider' $namedata></div>";
                });

    }

    public function enqueue_scripts() {
        wp_enqueue_style('flexslider', plugins_url( 'css/flexslider.css', __FILE__ ), array(), filemtime( plugin_dir_path( __FILE__ ) . 'css/flexslider.css'));
        wp_enqueue_style('bookslider', plugins_url( 'css/bookslider.css', __FILE__ ), array('flexslider'), filemtime( plugin_dir_path( __FILE__ ) . 'css/bookslider.css'));
        wp_enqueue_script('flexslider', plugins_url('js/jquery.flexslider.js', __FILE__), array('jquery'), filemtime( plugin_dir_path( __FILE__ ) . 'js/jquery.flexslider.js'));
        wp_register_script('AuthorBookSlider', plugins_url( 'js/wl-bookshelf-slider.js', __FILE__ ), array('flexslider'), filemtime( plugin_dir_path( __FILE__ ) . 'js/author-books.js'));
        wp_localize_script('AuthorBookSlider', 'AuthorBookSliderSettings',
                array('slidertitle' => __('Books in bokhylla.no', 'litteraturnett'),
                    'previous' => __('Prev', 'litteraturnett'),
                    'play' => __('Play', 'litteraturnett'),
                    'pause' => __('Pause', 'litteraturnett'),
                    'next' => __('Next', 'litteraturnett'),
                    )
                );
        wp_enqueue_script('AuthorBookSlider');
    }

    public function plugins_loaded () {
        $ok = load_plugin_textdomain('wl-bookshelf-slider', false, basename( dirname( __FILE__ ) ) . "/languages");
    }

    public function admin_init () {
        register_setting('wl-bookshelf-slider_options','wl-bookshelf-slider_options', array($this,'validate'));
    }

    public function admin_menu () {
    }
    // Helper function for creating an admin notice.
    public function add_admin_notice($notice,$type='info') {
        add_action('admin_notices', function() use ($notice,$type) { echo "<div class='notice notice-$type is-dismissible'><p>$notice</p></div>"; });
    }
    public function validate ($input) {
        $current =  get_option('wl-bookshelf-slider_options'); 

        $valid = array();
        foreach($input as $k=>$v) {
            switch ($k) {
                default: 
                    $valid[$k] = $v;
            }
        }
        return $valid;
    }
    public function activate () {
        $default = array();
        add_option('wl-bookshelf-slider_options',$default,false);
    }
    public static  function deactivate () {
        global $wpdb;
    }
    public static function uninstall() {
    }


}
