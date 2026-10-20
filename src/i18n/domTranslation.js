/* eslint-disable no-dupe-keys */
import i18n from './config';

// Shared UI dictionary used for legacy components that still contain literal labels.
// Components with localized product/customer data continue using the API's language fields.
const UI_AR = {
  'Home': 'الرئيسية', 'Products': 'المنتجات', 'All Products': 'جميع المنتجات', 'Product': 'المنتج',
  'All category': 'كل التصنيفات', 'All Categories': 'جميع التصنيفات', 'Category': 'التصنيف', 'Categories': 'التصنيفات',
  'Hot offers': 'العروض المميزة', 'Gift boxes': 'صناديق الهدايا', 'About Us': 'من نحن', 'Help': 'المساعدة',
  'Help Center': 'مركز المساعدة', 'Shipping & Delivery': 'الشحن والتوصيل', 'Returns & Refunds': 'الإرجاع والاسترداد',
  'Profile': 'الملف الشخصي', 'Message': 'الرسائل', 'Favorites': 'المفضلة', 'Orders': 'الطلبات', 'My cart': 'سلة التسوق',
  'Search': 'بحث', 'Search products...': 'ابحث عن المنتجات...', 'Search products': 'ابحث عن المنتجات', 'Search...': 'بحث...',
  'Search by name': 'البحث بالاسم', 'Electronics': 'الإلكترونيات', 'Watches': 'الساعات', 'All category Option': 'كل التصنيفات',
  'Language': 'اللغة', 'English': 'الإنجليزية', 'Arabic': 'العربية', 'العربية': 'العربية', 'English details': 'التفاصيل بالإنجليزية',
  'Arabic details': 'التفاصيل بالعربية', 'Light Mode': 'الوضع الفاتح', 'Dark Mode': 'الوضع الداكن', 'Toggle theme': 'تبديل المظهر',
  'Login': 'تسجيل الدخول', 'Log in': 'تسجيل الدخول', 'Login / Register': 'تسجيل الدخول / إنشاء حساب', 'Logout': 'تسجيل الخروج',
  'Register': 'إنشاء حساب', 'Join now': 'انضم الآن', 'Admin Login': 'دخول المسؤول', 'Admin email': 'البريد الإلكتروني للمسؤول',
  'Password': 'كلمة المرور', 'Sign in': 'تسجيل الدخول', 'Signing in...': 'جارٍ تسجيل الدخول...', 'Welcome!': 'أهلاً بك!',
  'Please Log in to continue': 'يرجى تسجيل الدخول للمتابعة', 'Please log in first to access this page.': 'يرجى تسجيل الدخول أولاً للوصول إلى هذه الصفحة.',
  'Add number': 'أدخل رقم الهاتف', 'Submiting...': 'جارٍ الإرسال...', 'Submitting...': 'جارٍ الإرسال...', 'Verification': 'التحقق',
  'Verify': 'تحقق', 'Go back': 'العودة', 'Back': 'رجوع', 'Save': 'حفظ', 'Save Product': 'حفظ المنتج', 'Save Category': 'حفظ التصنيف',
  'Update': 'تحديث', 'Update Product': 'تحديث المنتج', 'Update Category': 'تحديث التصنيف', 'Saving...': 'جارٍ الحفظ...',
  'New Product': 'إضافة منتج', 'Edit Product': 'تعديل المنتج', 'New Category': 'إضافة تصنيف', 'Edit Category': 'تعديل التصنيف',
  'Add Product': 'إضافة منتج', 'Add Category': 'إضافة تصنيف', 'Delete': 'حذف', 'Refresh': 'تحديث', 'Try again': 'حاول مجدداً',
  'Dashboard': 'لوحة التحكم', 'Dashboard Overview': 'نظرة عامة على لوحة التحكم', 'Borcelle Admin': 'إدارة بورسيل',
  'Total Products': 'إجمالي المنتجات', 'Total Orders': 'إجمالي الطلبات', 'Categories': 'التصنيفات', 'Customers': 'العملاء',
  'Total Sales (Recent Orders)': 'إجمالي المبيعات (أحدث الطلبات)', 'Products by Category': 'المنتجات حسب التصنيف',
  'Orders Status': 'حالات الطلبات', 'No order sales data is available yet.': 'لا تتوفر بيانات مبيعات للطلبات بعد.',
  'No category product counts are available yet.': 'لا تتوفر بيانات لعدد المنتجات ضمن التصنيفات بعد.', 'No order status data is available yet.': 'لا تتوفر بيانات لحالات الطلبات بعد.',
  'Brands': 'العلامات التجارية', 'Cities': 'المدن', 'Municipals': 'البلديات', 'Orders Status': 'حالات الطلبات',
  'Loading Dashboard...': 'جارٍ تحميل لوحة التحكم...', 'Loading products from API...': 'جارٍ تحميل المنتجات...', 'Loading categories...': 'جارٍ تحميل التصنيفات...',
  'Loading...': 'جارٍ التحميل...', 'Something went wrong': 'حدث خطأ غير متوقع', 'Something went wrong.': 'حدث خطأ غير متوقع.',
  'Failed to fetch products': 'فشل تحميل المنتجات', 'Failed to fetch categories': 'فشل تحميل التصنيفات', 'No products found. (API returned empty list)': 'لا توجد منتجات حالياً.',
  'No categories found.': 'لا توجد تصنيفات حالياً.', 'Name (EN)': 'الاسم بالإنجليزية', 'Name (AR)': 'الاسم بالعربية',
  'Name': 'الاسم', 'Description': 'الوصف', 'Description (EN)': 'الوصف بالإنجليزية', 'Description (AR)': 'الوصف بالعربية',
  'SKU': 'رمز المنتج', 'Price': 'السعر', 'Price (AED)': 'السعر (درهم)', 'Image': 'الصورة', 'Image URL': 'رابط الصورة',
  'Main product image': 'الصورة الأساسية للمنتج', 'Additional product images': 'صور إضافية للمنتج', 'Select category': 'اختاري التصنيف',
  'Choose one main image. JPG, PNG or WEBP recommended.': 'اختاري صورة أساسية واحدة. يفضّل استخدام JPG أو PNG أو WEBP.',
  'Select several images for the same product.': 'يمكنك اختيار عدة صور للمنتج نفسه.', 'Selected files:': 'الملفات المختارة:',
  'Clear selected main image': 'إزالة الصورة المختارة', 'English details': 'التفاصيل بالإنجليزية', 'Arabic details': 'التفاصيل بالعربية',
  'Actions': 'الإجراءات', 'Edit': 'تعديل', 'Name (EN)': 'الاسم بالإنجليزية', 'Image URL': 'رابط الصورة',
  'View details': 'عرض التفاصيل', 'Details': 'التفاصيل', 'Free Shipping': 'شحن مجاني', 'Free Ship': 'شحن مجاني', 'items found': 'منتج موجود', 'Items': 'المنتجات',
  'Filters': 'الفلاتر', 'Filter Products': 'تصفية المنتجات', 'Category': 'التصنيف', 'Brands': 'العلامات التجارية', 'Features': 'الميزات',
  'Price range': 'نطاق السعر', 'From': 'من', 'To': 'إلى', 'Min': 'الأدنى', 'Max': 'الأعلى', 'Minimum price': 'الحد الأدنى للسعر',
  'Maximum price': 'الحد الأعلى للسعر', 'Condition': 'الحالة', 'Any': 'الكل', 'Refurbished': 'مجدد', 'Brand new': 'جديد', 'Old items': 'مستعمل',
  'Reset All Filters': 'إعادة ضبط جميع الفلاتر', 'Show less': 'عرض أقل', 'See all': 'عرض الكل', 'Featured': 'مميز', 'Name: A to Z': 'الاسم: من أ إلى ي',
  'Name: Z to A': 'الاسم: من ي إلى أ', 'Price: Low to High': 'السعر: من الأقل إلى الأعلى', 'Price: High to Low': 'السعر: من الأعلى إلى الأقل',
  'Newest first': 'الأحدث أولاً', 'Best selling': 'الأكثر مبيعاً', 'items found': 'منتج موجود', 'Try adjusting your filters or search term.': 'حاول تعديل الفلاتر أو عبارة البحث.',
  'Welcome': 'أهلاً بك', 'Settings': 'الإعدادات', 'Full Name': 'الاسم الكامل', 'Phone': 'رقم الهاتف', 'Email': 'البريد الإلكتروني',
  'No email': 'لا يوجد بريد إلكتروني', 'Guest User': 'مستخدم زائر', 'Wishlist page': 'صفحة المفضلة', 'About us page': 'صفحة من نحن',
  'Contact us page': 'صفحة اتصل بنا', 'FAQ page': 'الأسئلة الشائعة', 'Terms and condition': 'الشروط والأحكام', 'Privacy Policy page': 'سياسة الخصوصية',
  'Contact us': 'اتصل بنا', 'Terms and Conditions': 'الشروط والأحكام', 'Terms and condition': 'الشروط والأحكام',
  'Checkout': 'إتمام الشراء', 'Continue': 'متابعة', 'Continue Shopping': 'متابعة التسوق', 'Your Shopping Bag': 'سلة التسوق',
  'Your cart is empty': 'سلة التسوق فارغة', 'My Shopping Cart': 'سلة التسوق', 'Remove': 'إزالة', 'Remove all': 'إزالة الكل',
  'Save for later': 'حفظ لوقت لاحق', 'Move to cart': 'نقل إلى السلة', 'Subtotal': 'المجموع الفرعي', 'Discount': 'الخصم', 'Tax': 'الضريبة',
  'Total': 'الإجمالي', 'Apply': 'تطبيق', 'Have a coupon?': 'هل لديك قسيمة خصم؟', 'Add coupon': 'إضافة قسيمة خصم', 'Send': 'إرسال', 'Subscribe': 'اشتراك',
  'Subscribe on our newsletter': 'اشترك في نشرتنا البريدية', 'Email': 'البريد الإلكتروني', 'Payment Method': 'طريقة الدفع', 'Payment method': 'طريقة الدفع',
  'Shipping Address': 'عنوان الشحن', 'Billing Address': 'عنوان الفوترة', 'Place Order': 'تأكيد الطلب', 'Order Details': 'تفاصيل الطلب',
  'Order History': 'سجل الطلبات', 'Order': 'طلب', 'Status': 'الحالة', 'Quantity': 'الكمية', 'Continue to payment': 'المتابعة إلى الدفع',
  'Add to cart': 'أضف إلى السلة', 'Add to favorites': 'أضف إلى المفضلة', 'Remove from favorites': 'إزالة من المفضلة', 'Related products': 'منتجات ذات صلة',
  'Recommended items': 'منتجات مقترحة', 'Deals and offers': 'العروض والصفقات', 'Our extra services': 'خدماتنا الإضافية', 'Suppliers by region': 'الموردون حسب المنطقة',
  'Latest trending': 'الأكثر رواجاً', 'Electronic items': 'الأجهزة الإلكترونية', 'Learn more': 'اعرف المزيد', 'Hi, user': 'مرحباً بك',
  "let's get started": 'لنبدأ الآن', 'Get US $10 off with a new supplier': 'احصل على خصم 10 دولارات مع مورد جديد',
  'Send quotes with supplier preferences': 'أرسل عروض الأسعار وفق تفضيلات الموردين', 'Back to shop': 'العودة إلى المتجر', 'Remove all': 'إزالة الكل',
  'Your Shopping Bag': 'سلة التسوق', 'Empty cart': 'السلة فارغة', 'Code sent successfully': 'تم إرسال الرمز بنجاح', 'Resend Code': 'إعادة إرسال الرمز',
  'Resend code': 'إعادة إرسال الرمز', 'Sending...': 'جارٍ الإرسال...', "Didn't receive code ?": 'لم يصلك الرمز؟', 'or': 'أو',
  'Please enter the 5-digit verification code': 'يرجى إدخال رمز التحقق المكوّن من خمسة أرقام', 'Invalid code': 'الرمز غير صحيح',
  'Back to shop': 'العودة إلى المتجر', 'Page not found': 'الصفحة غير موجودة', 'Save for later': 'حفظ لوقت لاحق',

  'No orders yet': 'لا توجد طلبات بعد', 'Your completed orders will appear here.': 'ستظهر طلباتك المكتملة هنا.',
  'Payment:': 'الدفع:', 'Total:': 'الإجمالي:', 'No favorites yet': 'لا توجد عناصر في المفضلة بعد',
  'Browse products and add your favorites.': 'تصفّح المنتجات وأضفها إلى المفضلة.', 'No products match your criteria.': 'لا توجد منتجات تطابق معاييرك.',
  'Page': 'الصفحة', 'of': 'من', 'Loading products...': 'جارٍ تحميل المنتجات...', 'Product not found': 'لم يتم العثور على المنتج',
  'Back to home': 'العودة إلى الرئيسية', 'Loading product details...': 'جارٍ تحميل تفاصيل المنتج...', 'In stock': 'متوفر',
  '/ per item': ' / لكل قطعة', 'Price:': 'السعر:', 'Negotiable': 'قابل للتفاوض', 'Type:': 'النوع:', 'Material:': 'المادة:',
  'Plastic material': 'مادة بلاستيكية', 'Design:': 'التصميم:', 'Modern nice': 'تصميم عصري', 'Customization:': 'التخصيص:',
  'Customized logo and design custom packages': 'إمكانية تخصيص الشعار والتصميم والعبوات', 'Protection:': 'الحماية:',
  'Refund Policy': 'سياسة الاسترداد', 'Warranty:': 'الضمان:', '2 years full warranty': 'ضمان كامل لمدة سنتين',
  'Supplier': 'المورّد', 'Guanjoi Trading LLC': 'شركة غوانجوي للتجارة', 'Germany, Berlin': 'برلين، ألمانيا',
  'reviews': 'تقييمات', 'sold': 'تم بيعها', 'Description': 'الوصف', 'Reviews': 'التقييمات', 'Shipping': 'الشحن',
  'About seller': 'عن البائع', 'Authentic quality guaranteed.': 'جودة أصلية مضمونة.', 'Full refund policy supported.': 'تتوفر سياسة استرداد كاملة.',
  'No reviews yet.': 'لا توجد تقييمات بعد.', 'Standard worldwide shipping available.': 'يتوفر الشحن القياسي إلى جميع أنحاء العالم.',
  'No detailed description available for this product.': 'لا يوجد وصف تفصيلي لهذا المنتج.', 'Verified supplier since 2015.': 'مورد موثّق منذ عام 2015.',
  'Super discount on more than 100 USD': 'خصم رائع على المشتريات التي تتجاوز 100 دولار', 'Related products': 'منتجات ذات صلة',
  'Address Name': 'اسم العنوان', 'City': 'المدينة', 'Neighborhood': 'الحي', 'Street': 'الشارع', 'Building': 'المبنى',
  'Zip Code': 'الرمز البريدي', 'Save Address': 'حفظ العنوان', 'Payment Method': 'طريقة الدفع', 'Cash': 'نقداً',
  'Discount Code': 'رمز الخصم', 'Coupon applied:': 'تم تطبيق القسيمة:', 'No items in cart': 'لا توجد منتجات في السلة',
  'Net Total': 'الصافي الإجمالي', 'Processing...': 'جارٍ المعالجة...', 'Login Required': 'تسجيل الدخول مطلوب',
  'Enter your details': 'أدخل بياناتك', 'Fill your information': 'أكمل معلوماتك', 'Add photo': 'إضافة صورة',
  'Welcome back,': 'مرحباً بعودتك،', 'Get US $10 off': 'احصل على خصم 10 دولارات', 'with a new': 'مع مورد جديد',
  'supplier': 'المورّد', 'Send quotes with': 'أرسل عروض الأسعار مع', 'preferences': 'التفضيلات', 'Days': 'أيام',
  'Hour': 'ساعة', 'Minute': 'دقيقة', 'Sec': 'ثانية', 'Pcs': 'قطعة', 'Kg': 'كغ', 'Liters': 'لتر', 'Boxes': 'صناديق',
  'My cart': 'سلة التسوق', 'Seller:': 'البائع:', 'Artel Market': 'سوق أرتيل', 'Have a coupon?': 'هل لديك قسيمة خصم؟',
  'Apply': 'تطبيق', 'Subtotal:': 'المجموع الفرعي:', 'Discount:': 'الخصم:', 'Tax:': 'الضريبة:', 'Total:': 'الإجمالي:',
  'Secure payment': 'دفع آمن', 'Customer support': 'دعم العملاء', 'Free delivery': 'توصيل مجاني', 'Saved for later': 'محفوظ لوقت لاحق',
  'Shop now': 'تسوق الآن', 'Have you ever finally just': 'كل ما تحتاج إليه في مكان واحد',
  'Get app': 'احصل على التطبيق', 'Download on the': 'حمّل من', 'GET IT ON': 'متوفر على', 'App Store': 'متجر التطبيقات',
  'Google Play': 'غوغل بلاي', "Let's get started": 'لنبدأ الآن', 'Where opportunities meet simplicity!': 'حيث تلتقي الفرص بالسهولة!',
  'Whether you\'re here to fill out your cart': 'سواء أكنت هنا لملء سلة التسوق', 'or to check irresistible offers.': 'أو لاكتشاف عروض لا تُقاوم.',
  'Sign in to your dashboard': 'سجّل الدخول إلى لوحة التحكم', 'Admin Login': 'دخول المسؤول', 'No orders yet': 'لا توجد طلبات بعد',
  'Loading municipals...': 'جارٍ تحميل البلديات...', 'No municipals found.': 'لم يتم العثور على بلديات.', 'Add Municipal': 'إضافة بلدية',
  'Loading cities...': 'جارٍ تحميل المدن...', 'No cities found.': 'لم يتم العثور على مدن.', 'Add City': 'إضافة مدينة',
  'Loading brands...': 'جارٍ تحميل العلامات التجارية...', 'No brands found.': 'لم يتم العثور على علامات تجارية.', 'Add Brand': 'إضافة علامة تجارية',
  'Order Details': 'تفاصيل الطلب', 'Order not found': 'لم يتم العثور على الطلب', 'Customer': 'العميل', 'Created at': 'تاريخ الإنشاء',
  'Pending': 'قيد الانتظار', 'Accepted': 'مقبول', 'Canceled': 'ملغي', 'Cancelled': 'ملغي', 'Completed': 'مكتمل', 'Delivered': 'تم التوصيل',
  'Paid': 'مدفوع', 'Unpaid': 'غير مدفوع', 'Total Price': 'السعر الإجمالي', 'Customer Name': 'اسم العميل', 'Phone Number': 'رقم الهاتف',
  'Find products': 'ابحث عن المنتجات', 'Name (AR)': 'الاسم بالعربية', 'Name (EN)': 'الاسم بالإنجليزية', 'City ID': 'معرّف المدينة',
  'Municipal ID': 'معرّف البلدية', 'Order ID': 'رقم الطلب', 'Created At': 'تاريخ الإنشاء', 'Price from': 'السعر من', 'Price to': 'السعر إلى',
  'Oldest first': 'الأقدم أولاً', 'Newest first': 'الأحدث أولاً', 'Free Shipping': 'شحن مجاني', 'All category': 'كل التصنيفات',
  'Apply Filters': 'تطبيق الفلاتر', 'Clear Filters': 'مسح الفلاتر', 'Filter by category': 'تصفية حسب التصنيف', 'Sort by': 'ترتيب حسب',
  'Total Products': 'إجمالي المنتجات', 'Total Orders': 'إجمالي الطلبات', 'Customers': 'العملاء', 'Dashboard Overview': 'نظرة عامة على لوحة التحكم',
  'Page not found': 'الصفحة غير موجودة', 'Please enter your phone number': 'يرجى إدخال رقم الهاتف', 'Phone must start with 09': 'يجب أن يبدأ رقم الهاتف بـ 09',
  'Phone must contain numbers only': 'يجب أن يحتوي رقم الهاتف على أرقام فقط', 'Phone must be at least 10 digits': 'يجب ألا يقل رقم الهاتف عن 10 أرقام',
  'Phone must be exactly 10 digits': 'يجب أن يتكون رقم الهاتف من 10 أرقام', 'Login error': 'خطأ في تسجيل الدخول',
  'Please enter your phone number': 'يرجى إدخال رقم الهاتف', 'Enter the code we send to :': 'أدخل الرمز الذي أرسلناه إلى:',
  'Code sent successfully': 'تم إرسال الرمز بنجاح', 'Please enter the 5-digit verification code': 'يرجى إدخال رمز التحقق المكوّن من خمسة أرقام',
  'Resend Code': 'إعادة إرسال الرمز', 'Sending...': 'جارٍ الإرسال...', "Didn't receive code ?": 'لم يصلك الرمز؟', 'or': 'أو',
  'Filter by price': 'تصفية حسب السعر', 'Order by': 'ترتيب حسب', 'ascending': 'تصاعدياً', 'descending': 'تنازلياً',
  'Automobiles': 'السيارات', 'Clothes and wear': 'الملابس والأزياء', 'Home interiors': 'الأثاث والديكور المنزلي',
  'Computer and tech': 'الحواسيب والتقنية', 'Tools, equipments': 'الأدوات والمعدات', 'Sports and outdoor': 'الرياضة والأنشطة الخارجية',
  'Animal and pets': 'الحيوانات الأليفة', 'Machinery tools': 'معدات وآلات', 'More category': 'المزيد من التصنيفات',
  'Welcome back,': 'مرحباً بعودتك،', 'User Avatar': 'صورة المستخدم', 'Address Name': 'اسم العنوان', 'Phone': 'رقم الهاتف',
  'Neighborhood': 'الحي', 'Street': 'الشارع', 'Building': 'المبنى', 'Zip Code': 'الرمز البريدي', 'Save Address': 'حفظ العنوان',
  'Address Name': 'اسم العنوان', 'No products available in this section.': 'لا توجد منتجات متاحة في هذا القسم.',
  'Source now': 'تسوّق الآن', 'Details': 'التفاصيل', 'Order #': 'رقم الطلب',
  'Payment': 'الدفع', 'No items in cart': 'لا توجد منتجات في السلة', 'Please choose a main product image.': 'يرجى اختيار الصورة الأساسية للمنتج.',
  'Enter a valid price greater than or equal to zero.': 'أدخلي سعراً صحيحاً أكبر من أو يساوي الصفر.',
  'Could not save product.': 'تعذر حفظ المنتج.', 'Failed to load categories': 'فشل تحميل التصنيفات.',
  'Other / Uncategorized': 'أخرى / دون تصنيف', 'Discount Code': 'رمز الخصم', 'Net Total': 'الصافي الإجمالي',
  'No products match your criteria.': 'لا توجد منتجات تطابق معاييرك.', 'Price: Low to High': 'السعر: من الأقل إلى الأعلى',
  'Price: High to Low': 'السعر: من الأعلى إلى الأقل', 'My Profile': 'ملفي الشخصي', 'Edit Profile': 'تعديل الملف الشخصي',
  'Current Password': 'كلمة المرور الحالية', 'New Password': 'كلمة المرور الجديدة', 'Confirm Password': 'تأكيد كلمة المرور',
  'Update Profile': 'تحديث الملف الشخصي', 'Order date': 'تاريخ الطلب', 'View Order': 'عرض الطلب', 'Back to products': 'العودة إلى المنتجات',

  'My Favorites': 'مفضلتي', 'My Orders': 'طلباتي', 'order(s) total': 'طلب إجمالاً', 'Start Shopping': 'ابدأ التسوق',
  'Browse Products': 'تصفح المنتجات', 'Added to cart ✅ (Removed from favorites)': 'تمت الإضافة إلى السلة وإزالة المنتج من المفضلة',
  'Failed to process:': 'تعذر إتمام العملية:', 'Your Shopping Bag': 'سلة التسوق', 'Loading order details...': 'جارٍ تحميل تفاصيل الطلب...',
  'Order not found': 'لم يتم العثور على الطلب', 'No items found for this order.': 'لا توجد منتجات في هذا الطلب.', 'Qty': 'الكمية',
  'Date:': 'التاريخ:', 'Payment:': 'الدفع:', 'Status:': 'الحالة:', 'Items': 'المنتجات', 'Item': 'المنتج',
  'Product Details': 'تفاصيل المنتج', 'You may also like': 'قد يعجبك أيضاً', 'Verified Seller': 'بائع موثّق', 'Worldwide shipping': 'شحن عالمي',
  'Send inquiry': 'إرسال استفسار', 'Saved in favorites': 'تمت الإضافة إلى المفضلة', 'Save for later': 'حفظ لوقت لاحق',
  'Remove from favorites': 'إزالة من المفضلة', 'Add to Cart': 'أضف إلى السلة', 'My Favorites': 'مفضلتي', 'items': 'عناصر',
  'Size:': 'المقاس:', 'Color:': 'اللون:', 'Material:': 'المادة:', 'Medium': 'متوسط', 'Blue': 'أزرق', 'Plastic': 'بلاستيك',
  'Seller:': 'البائع:', 'Back to shop': 'العودة إلى المتجر', 'Remove all': 'إزالة الكل', 'Have a coupon?': 'هل لديك قسيمة خصم؟',
  'Add coupon': 'إضافة قسيمة خصم', 'Apply': 'تطبيق', 'Subtotal:': 'المجموع الفرعي:', 'Discount:': 'الخصم:', 'Tax:': 'الضريبة:',
  'Secure payment': 'دفع آمن', 'Customer support': 'دعم العملاء', 'Free delivery': 'توصيل مجاني', 'Move to cart': 'نقل إلى السلة',
  'Have you ever finally just write dummy info': 'كل ما تحتاج إليه في مكان واحد', 'No favorites yet': 'لا توجد عناصر في المفضلة بعد',
  'No orders yet': 'لا توجد طلبات بعد', 'My Orders': 'طلباتي', 'Start Shopping': 'ابدأ التسوق', 'Order #': 'رقم الطلب',
  'Payment': 'الدفع', 'Total': 'الإجمالي', 'Total:': 'الإجمالي:', 'Order(s) total': 'طلب إجمالاً', 'N/A': 'غير متوفر',
  'Main product image': 'الصورة الأساسية للمنتج', 'Additional product images': 'صور إضافية للمنتج', 'Main product preview': 'معاينة الصورة الأساسية',
  'Product gallery': 'معرض صور المنتج', 'Selected files:': 'الملفات المختارة:', 'Clear selected main image': 'إزالة الصورة المختارة',
  'Please choose a main product image.': 'يرجى اختيار الصورة الأساسية للمنتج.', 'Enter a valid price greater than or equal to zero.': 'أدخلي سعراً صحيحاً أكبر من أو يساوي الصفر.',
  'Current Password': 'كلمة المرور الحالية', 'New Password': 'كلمة المرور الجديدة', 'Confirm Password': 'تأكيد كلمة المرور',
  'Update Profile': 'تحديث الملف الشخصي', 'Edit Profile': 'تعديل الملف الشخصي', 'Change password': 'تغيير كلمة المرور',
  'Your profile': 'ملفك الشخصي', 'Profile information': 'معلومات الملف الشخصي', 'First name': 'الاسم الأول', 'Last name': 'اسم العائلة',
  'Phone number': 'رقم الهاتف', 'Enter your name': 'أدخل اسمك', 'Enter your email': 'أدخل بريدك الإلكتروني', 'Upload photo': 'رفع صورة',
  'Address': 'العنوان', 'Address details': 'تفاصيل العنوان', 'Choose city': 'اختر المدينة', 'Choose neighborhood': 'اختر الحي',
  'Save changes': 'حفظ التغييرات', 'Cancel': 'إلغاء', 'Confirm': 'تأكيد', 'Close': 'إغلاق', 'Are you sure?': 'هل أنت متأكد؟',
  'Delete this product?': 'هل تريد حذف هذا المنتج؟', 'Delete this category?': 'هل تريد حذف هذا التصنيف؟', 'Delete this brand?': 'هل تريد حذف هذه العلامة التجارية؟',
  'Failed to delete product': 'فشل حذف المنتج', 'Failed to delete category': 'فشل حذف التصنيف', 'Failed to delete brand': 'فشل حذف العلامة التجارية',
  'Loading order details...': 'جارٍ تحميل تفاصيل الطلب...', 'Failed to fetch order details': 'فشل تحميل تفاصيل الطلب', 'Shipping Address': 'عنوان الشحن',
  'No categories found.': 'لا توجد تصنيفات حالياً.', 'No brands found.': 'لم يتم العثور على علامات تجارية.', 'No cities found.': 'لم يتم العثور على مدن.',
  'No municipals found.': 'لم يتم العثور على بلديات.', 'Loading brands...': 'جارٍ تحميل العلامات التجارية...', 'Loading cities...': 'جارٍ تحميل المدن...',
  'Loading municipals...': 'جارٍ تحميل البلديات...', 'Add Brand': 'إضافة علامة تجارية', 'Add City': 'إضافة مدينة', 'Add Municipal': 'إضافة بلدية',
  'Total count': 'العدد الإجمالي', 'Other / Uncategorized': 'أخرى / دون تصنيف', 'Refresh': 'تحديث', 'Toggle language': 'تبديل اللغة',
  'No products available in this section.': 'لا توجد منتجات متاحة في هذا القسم.', 'Source now': 'تسوّق الآن',
  'Current page': 'الصفحة الحالية', 'of': 'من', 'Page': 'الصفحة', 'Search product': 'البحث عن منتج', 'Clear': 'مسح',
  'Automobiles': 'السيارات', 'Clothes and wear': 'الملابس والأزياء', 'Home interiors': 'الأثاث والديكور المنزلي',
  'Computer and tech': 'الحواسيب والتقنية', 'Tools, equipments': 'الأدوات والمعدات', 'Sports and outdoor': 'الرياضة والأنشطة الخارجية',
  'Animal and pets': 'الحيوانات الأليفة', 'Machinery tools': 'معدات وآلات', 'More category': 'المزيد من التصنيفات',
  'Admin': 'المسؤول', 'User': 'المستخدم', 'Customer': 'العميل', 'Order date': 'تاريخ الطلب', 'Created at': 'تاريخ الإنشاء',
  'No products match your criteria.': 'لا توجد منتجات تطابق معاييرك.', 'Try adjusting your filters or search term.': 'حاول تعديل الفلاتر أو عبارة البحث.',
  'Please select a category.': 'يرجى اختيار تصنيف.', 'Please enter a name.': 'يرجى إدخال الاسم.', 'Could not save product.': 'تعذر حفظ المنتج.',
  'No address selected': 'لم يتم اختيار عنوان', 'Coupon applied:': 'تم تطبيق القسيمة:', 'Discount Code': 'رمز الخصم',
  'Cash': 'نقداً', 'Syriatel': 'سيريتل', 'MTN': 'إم تي إن', 'Payment Method': 'طريقة الدفع', 'Login Required': 'تسجيل الدخول مطلوب',
  'No items in cart': 'لا توجد منتجات في السلة', 'Net Total': 'الصافي الإجمالي', 'Processing...': 'جارٍ المعالجة...',
  'Account': 'الحساب', 'My Account': 'حسابي', 'About seller': 'عن البائع', 'Description': 'الوصف', 'Reviews': 'التقييمات',
  'Refund Policy': 'سياسة الاسترداد', 'Warranty:': 'الضمان:', 'Days': 'أيام', 'Hour': 'ساعة', 'Minute': 'دقيقة', 'Sec': 'ثانية',
  'SubTotal :': 'المجموع الفرعي:', 'No orders found.': 'لم يتم العثور على طلبات.', 'Loading orders...': 'جارٍ تحميل الطلبات...',
  'Action': 'الإجراء', 'ID': 'المعرّف', 'Image': 'الصورة', 'Order': 'طلب', 'Date': 'التاريخ', 'Date:': 'التاريخ:',
  'Status:': 'الحالة:', 'Payment:': 'الدفع:', 'Customer': 'العميل', 'Total': 'الإجمالي', 'Price': 'السعر', 'Qty': 'الكمية',
  'Name': 'الاسم', 'Name (EN)': 'الاسم بالإنجليزية', 'Name (AR)': 'الاسم بالعربية', 'Category': 'التصنيف', 'SKU': 'رمز المنتج',
  'All category': 'كل التصنيفات', 'Electronics': 'الإلكترونيات', 'Watches': 'الساعات', 'Search': 'بحث', 'Favorites': 'المفضلة',
  'Profile': 'الملف الشخصي', 'Message': 'الرسائل', 'Orders': 'الطلبات', 'My cart': 'سلة التسوق', 'English': 'الإنجليزية',
  'Welcome back,': 'مرحباً بعودتك،', "Let's get started": 'لنبدأ الآن', 'Loading products from API...': 'جارٍ تحميل المنتجات...',
  'No products found. (API returned empty list)': 'لا توجد منتجات حالياً.', 'No categories found.': 'لا توجد تصنيفات حالياً.',
  'Loading order details...': 'جارٍ تحميل تفاصيل الطلب...', 'No items found for this order.': 'لا توجد منتجات في هذا الطلب.',
  'Items': 'المنتجات', 'Free Shipping': 'شحن مجاني', 'Free Ship': 'شحن مجاني', 'View details': 'عرض التفاصيل',
  'Try adjusting your filters or search term.': 'حاول تعديل الفلاتر أو عبارة البحث.', 'items found': 'منتج موجود',
  'Browse products and add your favorites.': 'تصفّح المنتجات وأضفها إلى المفضلة.', 'Your completed orders will appear here.': 'ستظهر طلباتك المكتملة هنا.',
  'No email': 'لا يوجد بريد إلكتروني', 'Guest User': 'مستخدم زائر', 'Full Name': 'الاسم الكامل', 'Phone': 'رقم الهاتف',
  'Contact us': 'اتصل بنا', 'About Us': 'من نحن', 'Help Center': 'مركز المساعدة', 'Privacy Policy': 'سياسة الخصوصية',
  'The product has been added to your cart.': 'تمت إضافة المنتج إلى سلة التسوق.', 'Failed to add to cart': 'فشلت إضافة المنتج إلى السلة',
  'Your cart is empty': 'سلة التسوق فارغة', 'SubTotal': 'المجموع الفرعي', 'Subtotal': 'المجموع الفرعي',
  'Order status': 'حالة الطلب', 'Order number': 'رقم الطلب', 'Order date': 'تاريخ الطلب', 'Payment type': 'طريقة الدفع',
  'Shipping & Delivery': 'الشحن والتوصيل', 'Returns & Refunds': 'الإرجاع والاسترداد', 'Terms and Conditions': 'الشروط والأحكام',
  'Order information': 'معلومات الطلب', 'Customer details': 'بيانات العميل', 'No data available': 'لا توجد بيانات متاحة',
  'Select an option': 'اختر خياراً', 'Search products...': 'ابحث عن المنتجات...', 'Maximum price': 'الحد الأعلى للسعر',
  'Minimum price': 'الحد الأدنى للسعر', 'Sort by': 'ترتيب حسب', 'Oldest first': 'الأقدم أولاً', 'Newest first': 'الأحدث أولاً',
  'A-Z': 'أ إلى ي', 'Z-A': 'ي إلى أ', 'Oldest': 'الأقدم', 'Newest': 'الأحدث',
  'Dashboard': 'لوحة التحكم', 'Total Sales (Recent Orders)': 'إجمالي المبيعات (أحدث الطلبات)', 'Products by Category': 'المنتجات حسب التصنيف',
  'Orders Status': 'حالات الطلبات', 'No order sales data is available yet.': 'لا تتوفر بيانات مبيعات للطلبات بعد.',
  'No category product counts are available yet.': 'لا تتوفر بيانات لعدد المنتجات ضمن التصنيفات بعد.', 'No order status data is available yet.': 'لا تتوفر بيانات لحالات الطلبات بعد.'

};

const replacements = Object.entries(UI_AR).sort((a, b) => b[0].length - a[0].length);
const translateText = (input) => {
  const trimmed = input.trim();
  if (!trimmed) return input;
  const exact = UI_AR[trimmed];
  if (exact) return input.replace(trimmed, exact);
  let output = input;
  for (const [source, target] of replacements) {
    // Substring replacement only for multiword phrases, to avoid altering user/product names accidentally.
    if (source.includes(' ') && output.toLowerCase().includes(source.toLowerCase())) {
      output = output.replace(new RegExp(escapeRegExp(source), 'gi'), target);
    }
  }
  return output;
};
const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const trackedNodes = new Set();
const trackedElements = new Set();
const attributes = ['placeholder', 'title', 'aria-label', 'alt'];

function translateNode(node, language) {
  if (!node || node.nodeType !== Node.TEXT_NODE) return;
  const current = node.nodeValue || '';
  if (language !== 'ar') {
    if (node.__uiArabicTranslation && current === node.__uiArabicTranslation.last) node.nodeValue = node.__uiArabicTranslation.original;
    delete node.__uiArabicTranslation;
    trackedNodes.delete(node);
    return;
  }
  if (node.parentElement?.closest('script,style,noscript,code,pre')) return;
  if (node.__uiArabicTranslation && current === node.__uiArabicTranslation.last) return;
  const translated = translateText(current);
  if (translated !== current) {
    node.__uiArabicTranslation = { original: current, last: translated };
    trackedNodes.add(node);
    node.nodeValue = translated;
  }
}

function translateElement(element, language) {
  if (!(element instanceof Element)) return;
  attributes.forEach((attribute) => {
    if (!element.hasAttribute(attribute)) return;
    const current = element.getAttribute(attribute) || '';
    const saved = element.__uiArabicAttributes?.[attribute];
    if (language !== 'ar') {
      if (saved && current === saved.last) element.setAttribute(attribute, saved.original);
      if (element.__uiArabicAttributes) delete element.__uiArabicAttributes[attribute];
      return;
    }
    if (saved && current === saved.last) return;
    const translated = translateText(current);
    if (translated !== current) {
      element.__uiArabicAttributes = { ...(element.__uiArabicAttributes || {}), [attribute]: { original: current, last: translated } };
      trackedElements.add(element);
      element.setAttribute(attribute, translated);
    }
  });
}

function scan(root, language) {
  if (!root) return;
  if (root.nodeType === Node.TEXT_NODE) translateNode(root, language);
  if (root instanceof Element) translateElement(root, language);
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      return node.parentElement?.closest('script,style,noscript,code,pre') ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT;
    },
  });
  let node;
  while ((node = walker.nextNode())) translateNode(node, language);
  if (root.querySelectorAll) root.querySelectorAll('*').forEach((element) => translateElement(element, language));
}

function applyLanguage(language) {
  const lang = language?.startsWith('ar') ? 'ar' : 'en';
  if (lang === 'en') {
    trackedNodes.forEach((node) => {
      if (node.isConnected) translateNode(node, 'en');
    });
    trackedElements.forEach((element) => {
      if (element.isConnected) translateElement(element, 'en');
    });
  } else {
    scan(document.body, 'ar');
  }
  document.documentElement.lang = lang;
  document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
}

const observer = new MutationObserver((records) => {
  const lang = i18n.language?.startsWith('ar') ? 'ar' : 'en';
  records.forEach((record) => {
    if (record.type === 'characterData') translateNode(record.target, lang);
    if (record.type === 'attributes') translateElement(record.target, lang);
    record.addedNodes?.forEach((node) => {
      if (node.nodeType === Node.ELEMENT_NODE || node.nodeType === Node.TEXT_NODE) scan(node, lang);
    });
  });
});

if (typeof document !== 'undefined' && document.body) {
  applyLanguage(i18n.language);
  observer.observe(document.body, { subtree: true, childList: true, characterData: true, attributes: true, attributeFilter: attributes });
}
i18n.on('languageChanged', applyLanguage);

export default applyLanguage;
