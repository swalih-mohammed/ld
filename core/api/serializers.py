from django_countries.serializer_fields import CountryField
from rest_framework import serializers
from core.models import (
    UserProfile, Address, Place, Shop, Item, Order, OrderItem, Coupon, Variation, ItemVariation, Area

)


class StringSerializer(serializers.StringRelatedField):
    def to_internal_value(self, value):
        return value


# class CouponSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Coupon
#         fields = (
#             'id',
#             'code',
#             'amount'
        # )

class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = '__all__'


class ItemSerializer(serializers.ModelSerializer):
    category_name = serializers.ReadOnlyField(source='category.name')

    class Meta:
        model = Item
        fields = '__all__'
        # fields = (
        #     'id',
        #     'shop',
        #     'title',
        #     'price',
        #     'discount_price',
        #     'category_name',
        #     'slug',
        #     'description',
        #     'image',
        #     'is_available'
        # )


class PlaceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Place
        fields = '__all__'


class AreaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Area
        fields = '__all__'


class ShopSerializer(serializers.ModelSerializer):
    place = serializers.ReadOnlyField(source='place.name')

    class Meta:
        model = Shop
        fields = '__all__'


class ShopProductSerializer(serializers.ModelSerializer):
    category_name = serializers.ReadOnlyField(source='category.name')
    shop_name = serializers.ReadOnlyField(source='shop.name')

    class Meta:
        model = Item
        fields = '__all__'
        # fields = (
        #     'id',
        #     'shop_name',
        #     'title',
        #     'price',
        #     'discount_price',
        #     'category_name',
        #     'slug',
        #     'description',
        #     'image',
        #     'is_available'
        # )


class VariationDetailSerializer(serializers.ModelSerializer):
    item = serializers.SerializerMethodField()

    class Meta:
        model = Variation
        fields = (
            'id',
            'name',
            'item',
        )

    def get_item(self, obj):
        return ItemSerializer(obj.item).data


class ItemVariationDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = ItemVariation
        fields = (
            'id',
            'value',
            'attachment',
            'variation'
        )

    def get_variation(self, obj):
        return VariationDetailSerializer(obj.variation).data


class OrderItemSerializer(serializers.ModelSerializer):
    item_variations = serializers.SerializerMethodField()
    item = serializers.SerializerMethodField()
    final_price = serializers.SerializerMethodField()
    shop_name = serializers.ReadOnlyField(source='shop.name')

    class Meta:
        model = OrderItem
        fields = '__all__'
        # fields = (
        #     'id',
        #     'item',
        #     'item_variations',
        #     'final_price',
        #     'quantity',
        #     'ordered',
        #     'shop_name'
        # )

    def get_item(self, obj):
        return ItemSerializer(obj.item).data

    def get_item_variations(self, obj):
        return ItemVariationDetailSerializer(obj.item_variations.all(), many=True).data

    def get_final_price(self, obj):
        return obj.get_final_price()


class OrderSerializer(serializers.ModelSerializer):
    order_items = serializers.SerializerMethodField()
    total = serializers.SerializerMethodField()
    # coupon = serializers.SerializerMethodField()
    # start_date = serializers.DateField(format="%Y-%m-%d %H:%M:%S")
    start_date = serializers.DateTimeField(format="%d-%m-%Y")
    shop_name = serializers.ReadOnlyField(source='shop.name')
    place_name = serializers.ReadOnlyField(source='place.name')
    customer_name = serializers.ReadOnlyField(source='user.username')

    class Meta:
        model = Order
        # fields = '__all__'
        fields = (
            'id',
            'order_items',
            'total',
            # 'coupon',
            'shop_name',
            'order_status',
            'shipping_address',
            'start_date',
            'mode_of_payment',
            'place_name',
            'customer_name'
        )

    def get_order_items(self, obj):
        return OrderItemSerializer(obj.items.all(), many=True).data

    def get_total(self, obj):
        return obj.get_total()

    def get_coupon(self, obj):
        if obj.coupon is not None:
            return CouponSerializer(obj.coupon).data
        return None


class ItemVariationSerializer(serializers.ModelSerializer):
    class Meta:
        model = ItemVariation
        fields = (
            'id',
            'value',
            'attachment'
        )


class VariationSerializer(serializers.ModelSerializer):
    item_variations = serializers.SerializerMethodField()

    class Meta:
        model = Variation
        fields = (
            'id',
            'name',
            'item_variations'
        )

    def get_item_variations(self, obj):
        return ItemVariationSerializer(obj.itemvariation_set.all(), many=True).data


class ItemDetailSerializer(serializers.ModelSerializer):
    # category = serializers.SerializerMethodField()
    # label = serializers.SerializerMethodField()
    variations = serializers.SerializerMethodField()

    class Meta:
        model = Item
        fields = (
            'id',
            'title',
            'price',
            'discount_price',
            'category',
            'slug',
            'description',
            'image',
            'variations'
        )

    # def get_category(self, obj):
    #     return obj.get_category_display()

    #

    def get_variations(self, obj):
        return VariationSerializer(obj.variation_set.all(), many=True).data


class AddressSerializer(serializers.ModelSerializer):
    # country = CountryField()

    class Meta:
        model = Address
        fields = '__all__'


# class PaymentSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Payment
#         fields = (
#             'id',
#             'amount',
#             'timestamp'
#         )
