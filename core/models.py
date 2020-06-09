from django.db.models.signals import post_save
from django.conf import settings
from django.db import models
from django.db.models import Sum
from django.shortcuts import reverse
from django_countries.fields import CountryField

SHOP_CHOICES = (
    ('Grocery Store', 'Grocery Store'),
    ('Meat Shop', 'Meat Shop'),
    ('Chicken Shop', 'Chicken Shop')
)

LABEL_CHOICES = (
    ('P', 'primary'),
    ('S', 'secondary'),
    ('D', 'danger')
)

ADDRESS_CHOICES = (
    ('B', 'Billing'),
    ('S', 'Shipping'),
)
PAYMENT_CHOICES = (
    ('Cash on Delivery', 'Cash on Delivery'),
    ('Patt - Kadam', 'Patt - Kadam'),
)

ORDER_STATUS_CHOICES = (
    ('Pending', 'Pending'),
    ('Accepted by shop', 'Accepted by shop'),
    ('Cancelled by shop', 'Cancelled by shop'),
    ('Accepted for Delivery', 'Accepted for Delivery'),
    ('Cancelled by Delivery staff', 'Cancelled by Delivery staff'),
    ('On the way', 'On the way'),
    ('Delivered', 'Delivered'),
)


class Place(models.Model):
    name = models.CharField(max_length=100)
    slug = models.SlugField()
    # area = models.CharField(max_length=100)
    village = models.CharField(max_length=100)
    district = models.CharField(max_length=100)
    state = models.CharField(max_length=100)
    pin_code = models.CharField(max_length=6)
    is_shipping = models.BooleanField(default=False)

    def __str__(self):
        return self.name


class Area(models.Model):
    name = models.CharField(max_length=100)
    place = models.ForeignKey(Place, on_delete=models.CASCADE)
    is_shipping = models.BooleanField(default=False)

    def __str__(self):
        return self.name


class DeliveryStaff(models.Model):
    name = models.CharField(max_length=100)
    user = models.ForeignKey(settings.AUTH_USER_MODEL,
                             on_delete=models.CASCADE)
    place = models.ForeignKey(Place, on_delete=models.CASCADE)

    def __str__(self):
        return self.name


class Shop(models.Model):
    place = models.ForeignKey(Place,
                              on_delete=models.CASCADE)
    owner = models.ForeignKey(settings.AUTH_USER_MODEL,
                              on_delete=models.CASCADE, blank=True, null=True)
    name = models.CharField(max_length=100)
    slug = models.SlugField()
    category = models.CharField(choices=SHOP_CHOICES, max_length=200)
    slug = models.SlugField()
    description = models.TextField()
    image = models.ImageField()
    is_accepting_orders = models.BooleanField(default=False)

    def __str__(self):
        return self.name


class UserProfile(models.Model):
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    phone_number = models.CharField(max_length=11, blank=True, null=True)
    one_click_purchasing = models.BooleanField(default=False)
    is_customer = models.BooleanField(default=True)
    is_shop_owner = models.BooleanField(default=False)
    is_delivery_staff = models.BooleanField(default=False)

    def __str__(self):
        return self.user.username


class Category(models.Model):
    name = models.CharField(max_length=100)
    slug = models.SlugField()
    description = models.TextField(blank=True, null=True)
    image = models.ImageField(blank=True, null=True)

    def __str__(self):
        return self.name


class Item(models.Model):
    shop = models.ForeignKey(Shop,
                             on_delete=models.CASCADE)
    title = models.CharField(max_length=100)
    price = models.FloatField()
    discount_price = models.FloatField(blank=True, null=True)
    category = models.ForeignKey(Category,
                                 on_delete=models.CASCADE)
    slug = models.SlugField()
    description = models.TextField()
    image = models.ImageField()
    is_available = models.BooleanField(default=False, null=True)

    def __str__(self):
        return self.title

    def get_absolute_url(self):
        return reverse("core:product", kwargs={
            'slug': self.slug
        })

    def get_add_to_cart_url(self):
        return reverse("core:add-to-cart", kwargs={
            'slug': self.slug
        })

    def get_remove_from_cart_url(self):
        return reverse("core:remove-from-cart", kwargs={
            'slug': self.slug
        })


class Variation(models.Model):
    item = models.ForeignKey(Item, on_delete=models.CASCADE)
    name = models.CharField(max_length=50)  # size

    class Meta:
        unique_together = (
            ('item', 'name')
        )

    def __str__(self):
        return self.name


class ItemVariation(models.Model):
    variation = models.ForeignKey(Variation, on_delete=models.CASCADE)
    value = models.CharField(max_length=50)  # S, M, L
    attachment = models.ImageField(blank=True)

    class Meta:
        unique_together = (
            ('variation', 'value')
        )

    def __str__(self):
        return self.value


class OrderItem(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL,
                             on_delete=models.CASCADE)
    shop = models.ForeignKey(Shop,
                             on_delete=models.CASCADE, blank=True, null=True)
    place = models.ForeignKey(Place,
                              on_delete=models.CASCADE, blank=True, null=True)
    ordered = models.BooleanField(default=False)
    item = models.ForeignKey(Item, on_delete=models.CASCADE)
    item_variations = models.ManyToManyField(ItemVariation)
    quantity = models.IntegerField(default=1)

    def __str__(self):
        return f"{self.quantity} of {self.item.title}"

    def get_total_item_price(self):
        return self.quantity * self.item.price

    def get_total_discount_item_price(self):
        return self.quantity * self.item.discount_price

    def get_amount_saved(self):
        return self.get_total_item_price() - self.get_total_discount_item_price()

    def get_final_price(self):
        if self.item.discount_price:
            return self.get_total_discount_item_price()
        return self.get_total_item_price()


class Address(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL,
                             on_delete=models.CASCADE)
    house_name = models.CharField(max_length=100)
    place = models.CharField(max_length=100)
    road_name = models.CharField(max_length=100)
    area = models.CharField(max_length=100)
    village = models.CharField(max_length=100, blank=True, null=True)
    district = models.CharField(max_length=100)
    state = models.CharField(max_length=100)
    pin_code = models.CharField(max_length=100)
    phone_number = models.CharField(max_length=10, blank=True, null=True)
    address_type = models.CharField(max_length=1, choices=ADDRESS_CHOICES)
    default = models.BooleanField(default=True)

    # def __str__(self):
    #     return self.user.username
    def __str__(self):
        return self.place

    class Meta:
        verbose_name_plural = 'Addresses'


class Order(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL,
                             on_delete=models.CASCADE)
    shop = models.ForeignKey(Shop,
                             on_delete=models.CASCADE, blank=True, null=True)
    place = models.ForeignKey(Place,
                              on_delete=models.CASCADE, blank=True, null=True)
    shipping_address = models.ForeignKey(Address,
                                         on_delete=models.CASCADE, blank=True, null=True)
    ref_code = models.CharField(max_length=20, blank=True, null=True)
    items = models.ManyToManyField(OrderItem)
    start_date = models.DateTimeField(auto_now_add=True)
    ordered_date = models.DateTimeField()
    ordered = models.BooleanField(default=False)
    # shipping_address = models.ForeignKey(
    # 'Address', related_name='shipping_address', on_delete=models.SET_NULL, blank=True, null=True)
    billing_address = models.ForeignKey(
        'Address', related_name='billing_address', on_delete=models.SET_NULL, blank=True, null=True)
    coupon = models.ForeignKey(
        'Coupon', on_delete=models.SET_NULL, blank=True, null=True)
    mode_of_payment = models.CharField(
        choices=PAYMENT_CHOICES, max_length=50, blank=True, null=True)
    order_status = models.CharField(
        choices=ORDER_STATUS_CHOICES, default='Not Accepted by Shop', max_length=200, blank=True, null=True)

    class Meta:
        ordering = ['start_date', 'pk']

    def __str__(self):
        return self.user.username

    def get_total(self):
        total = 0
        for order_item in self.items.all():
            total += order_item.get_final_price()
        if self.coupon:
            total -= self.coupon.amount
        return total


# class Payment(models.Model):
#     stripe_charge_id = models.CharField(max_length=50)
#     user = models.ForeignKey(settings.AUTH_USER_MODEL,
#                              on_delete=models.SET_NULL, blank=True, null=True)
#     amount = models.FloatField()
#     timestamp = models.DateTimeField(auto_now_add=True)

#     def __str__(self):
#         return self.user.username


class Coupon(models.Model):
    code = models.CharField(max_length=15)
    amount = models.FloatField()

    def __str__(self):
        return self.code


class Refund(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE)
    reason = models.TextField()
    accepted = models.BooleanField(default=False)
    email = models.EmailField()

    def __str__(self):
        return f"{self.pk}"


def userprofile_receiver(sender, instance, created, *args, **kwargs):
    if created:
        userprofile = UserProfile.objects.create(user=instance)


post_save.connect(userprofile_receiver, sender=settings.AUTH_USER_MODEL)
