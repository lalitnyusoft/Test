import { ConsoleLogger, ForbiddenException, Injectable, NotFoundException, UnauthorizedException, UnprocessableEntityException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from 'src/models/user.model';
//import { UserRoles } from 'src/models/userRole.model';
import { HelperService } from 'src/services/Helper.service';
import { JwtUserDTO } from '../auth/dto/JwtUser.dto';
import { UserRegisterDTO } from '../auth/dto/userRegister.dto';
import { UserAuthenticateInterface } from './interfaces/userAuthenticate.interface';
import { EditProfileDTO } from './dto/EditProfile.dto';
const bcrypt = require('bcryptjs');
import { Op, where } from 'sequelize';
import sequelize from 'sequelize';
import { ChangePasswordDTO } from './dto/ChangePassword.dto';
import { Brand } from 'src/models/brand.model';
import { EditSellerProfile } from './dto/EditSellerProfile.dto';
import { State } from 'src/models/state.model';
import { MedRec } from 'src/models/medRec.model';
import { Follower } from 'src/models/follower.model';
import { Product } from 'src/models/product.model';
const fs = require('fs')
@Injectable()
export class UserService {
    constructor(
        @InjectModel(User)
        private userModel: typeof User,
        @InjectModel(Brand)
        private brandModel: typeof Brand,
    ) { }

    async authenticate(userAuthenticateInterface: UserAuthenticateInterface) {
        const userRepo = this.userModel;
        const user = await userRepo.findOne({
            where: { email: userAuthenticateInterface.username },
        });

        if (!user) {
            return false;
        }
        if (+user.isActive !== 1) {
            throw new ForbiddenException('Your account has been deactivated');
        }
        const isPasswordMatching = await bcrypt.compare(
            userAuthenticateInterface.password,
            user.password,
        );

        if (!isPasswordMatching) {
            return false;
        }
        user.password = undefined;
        return user;
    }

    async checkUser(userRegisterDTO: UserRegisterDTO) {
        const userRepo = this.userModel;
        const emailExist = await userRepo.findOne({
            where: {
                email: userRegisterDTO.email,
            },
        });

        if (emailExist) {
            throw new UnprocessableEntityException(
                'Email already exist, Please try another.',
            );
        }
        return true;
    }

    /*     async registerUser(userRegisterDTO: UserRegisterDTO) {
            const userRepo = this.userModel;
            const emailExist = await userRepo.findOne({
                where: {
                    email: userRegisterDTO.email,
                },
            });
            if (emailExist) {
                throw new UnprocessableEntityException(
                    'Email already exist, Please try another.',
                );
            }
            const hash = bcrypt.hashSync(userRegisterDTO.password, 10);
            const user = await this.userModel.create({
                email: userRegisterDTO.email,
                firstName: userRegisterDTO.firstName,
                lastName: userRegisterDTO.lastName,
                password: hash,
                role: userRegisterDTO.role,
                state: userRegisterDTO.state,
                zipCode: userRegisterDTO.zipCode,
                phoneNumber: userRegisterDTO.phoneNumber,
                licenseNumber: userRegisterDTO.licenseNumber,
                licenseType: userRegisterDTO.licenseType,
                expirationDate: userRegisterDTO.expirationDate,
                profilePath: userRegisterDTO.profilePath,
                licensePath: userRegisterDTO.licensePath,
                //planId: userRegisterDTO.planId,
                planExpiryDate: userRegisterDTO.planExpiryDate,
                subscriptionId: userRegisterDTO.subscriptionId,
            });
            return user != null;
        }
     */
    async getUsers() {
        const users = await this.userModel.findAll({
            order: [['id', 'DESC']],
        });
        return users;
    }

    async getUserProfile(jwtUserDTO: JwtUserDTO) {
        const user = await this.userModel.findOne({
            include: [
                MedRec
            ],
            attributes: ['profilePath', 'businessName', 'email', 'phoneNumber', 'stateId', 'zipCode', 'medRecId', 'licenseNumber', 'expirationDate', 'licensePath'],
            where: { id: jwtUserDTO.id, role: '3' }
        });
        if (!user) throw new NotFoundException();
        return user;
    }

    async findOne(id: number) {
        return await this.checkExist(id);
    }

    async createUser(jwtUserDto: JwtUserDTO, userRegisterDTO: UserRegisterDTO) {
        const helperService = await new HelperService();
        await helperService.checkUnique(
            this.userModel,
            'email',
            userRegisterDTO.email,
            'email',
        );
        const hash = bcrypt.hashSync(userRegisterDTO.password, 10);
        const user = await this.userModel.create({
            email: userRegisterDTO.email,
            // firstName: userRegisterDTO.firstName,
            // lastName: userRegisterDTO.lastName,
            businessName: userRegisterDTO.businessName,
            password: hash,
            role: userRegisterDTO.role,
            // is_active: true,
            createdBy: jwtUserDto.id,
        });
        return user != null;
    }

    async deleteUser(id: number) {
        await this.checkExist(id);
        await this.userModel.destroy({
            where: { id: id },
        });
        return true;
    }

    async checkExist(id: number) {
        const user = await this.userModel.findOne({
            where: { id: id },
        });
        if (!user) throw new NotFoundException();
        return user;
    }

    async updateProfile(jwtUserDto: JwtUserDTO, updatedUserData: EditProfileDTO, files) {
        const user = await this.checkExist(jwtUserDto.id);
        const licenseDocumentPath = await files.licenseDocument ? files.licenseDocument[0].filename : updatedUserData.licensePath ? updatedUserData.licensePath : null;
        const profileDocumentPath = await files.profileDocument ? files.profileDocument[0].filename : updatedUserData.profilePath ? updatedUserData.profilePath : null;
        updatedUserData.licensePath = licenseDocumentPath;
        updatedUserData.profilePath = profileDocumentPath;
        if (!user) {
            return false;
        }
        if (files.licenseDocument && fs.existsSync('../assets' + user.licensePath)) {
            fs.unlink('../assets' + user.licensePath, (err) => {
                if (err) {
                    return;
                }
            })
        }
        if (files.profileDocument && fs.existsSync('../assets' + user.profilePath) && user.profilePath !== '/profile/no-profile-image.jpg') {
            fs.unlink('../assets' + user.profilePath, (err) => {
                if (err) {
                    return;
                }
            })
        }
        await user.update(updatedUserData);
        return user;
    }

    async changePassword(jwtUserDto: JwtUserDTO, changePasswordData: ChangePasswordDTO) {
        const user = await this.userModel.findOne({
            where: { id: jwtUserDto.id, email: jwtUserDto.email },
        });

        if (!user) {
            throw new NotFoundException();
        }

        const isPasswordMatching = await bcrypt.compare(
            changePasswordData.currentPassword,
            user.password,
        );
        if (!isPasswordMatching) {
            return { status: false, message: 'Current password does not match.' };
        }
        if (changePasswordData.newPassword !== changePasswordData.confirmNewPassword) {
            return { status: false, message: 'New password and confirm new password does not match.' };
        }
        const hash = bcrypt.hashSync(changePasswordData.newPassword, 10);
        user.password = hash;
        user.update({ 'password': hash });
        return { status: true, message: 'Password changed successfully.' };
    }

    async getSellerProfile(jwtUserDTO: JwtUserDTO) {
        const user = await this.userModel.findOne({
            include: [
                { model: Brand },
                State
            ],
            where: { id: jwtUserDTO.id, role: '2' },
            attributes: { exclude: ['id', 'isActive', 'role', 'subscriptionId', 'password', 'verification_token'] }
        });
        if (!user) throw new NotFoundException();
        return user;
    }

    async updateSellerProfile(jwtUserDto: JwtUserDTO, updatedUserData: EditSellerProfile, files) {
        const user = await this.checkExist(jwtUserDto.id);
        const brand = await this.brandModel.findOne({
            where: { userId: user.id },
        });
        if (!brand || !user) throw new NotFoundException();
        updatedUserData.website = updatedUserData.website !== '' && updatedUserData.website !== null ? updatedUserData.website : null;
        const licenseDocumentPath = await files.licenseDocument ? files.licenseDocument[0].filename : updatedUserData.licensePath ? updatedUserData.licensePath : null;
        const profileDocumentPath = await files.profileDocument ? files.profileDocument[0].filename : updatedUserData.profilePath ? updatedUserData.profilePath : null;
        updatedUserData.licensePath = licenseDocumentPath;
        updatedUserData.profilePath = profileDocumentPath;
        updatedUserData.avgOrder = (updatedUserData.avgOrder !== '' && updatedUserData.avgOrder !== null && updatedUserData.avgOrder !== undefined) ? updatedUserData.avgOrder : null;
        if (files.licenseDocument && fs.existsSync('../assets' + user.licensePath)) {
            fs.unlink('../assets' + user.licensePath, (err) => {
                if (err) {
                    return;
                }
            })
        }
        if (files.profileDocument && fs.existsSync('../assets' + user.profilePath) && user.profilePath !== '/profile/no-profile-image.jpg') {
            fs.unlink('../assets' + user.profilePath, (err) => {
                if (err) {
                    return;
                }
            })
        }
        await user.update(updatedUserData);
        await brand.update(updatedUserData);
        return { ...user.toJSON(), ...brand.toJSON() };
    }

    async getRetailers(jwtUserDto: JwtUserDTO, offset: number = 0, limit: number = 10) {
        const { count, rows: retailers } = await this.userModel.findAndCountAll({
            include: [State],
            where: { role: 3, isActive: 1 },
            offset: offset ? offset * limit : 0,
            limit: limit
        });
        return {
            count: count,
            currentPage: offset ? +offset : 0,
            totalPages: Math.ceil(count / limit),
            retailers: retailers,
        };
    }

    async getBrands(offset: number = 0, limit: number = 10) {
        const { count, rows: brands } = await this.brandModel.findAndCountAll({
            include: [
                { model: Product, as: 'product', where: { isActive: 1 }, required: false },
                {
                    model: User, include: [{ model: State }]
                },
            ],
            distinct: true,
            where: { isActive: 1 },
            offset: offset ? offset * limit : 0,
            limit: limit
        });
        return {
            count: count,
            currentPage: offset ? +offset : 0,
            totalPages: Math.ceil(count / limit),
            brands: brands,
        };
    }

    async getRetailerDetail(slug: string) {
        const user = await this.userModel.findOne({
            include: [
                { model: State },
                { model: Follower, as: 'followers', where: { isActive: 1 }, required: false },
                { model: Follower, as: 'followings', where: { isActive: 1 }, required: false }
            ],
            where: { slug: slug, role: 3, isActive: 1 },
        });
        if (!user) throw new NotFoundException();
        return user;
    }

    async deleteUserAccount(jwtUserDto: JwtUserDTO) {
        const user = await this.userModel.findOne({
            where: {
                id: jwtUserDto.id
            }
        });
        if (!user) throw new NotFoundException();

        await this.userModel.destroy({
            where: { id: jwtUserDto.id },
        });
        return true;
    }

    async findUserCompany(limit: number, page: number, jwtUserDto: JwtUserDTO) {
        const user = await this.checkExist(jwtUserDto.id);
        const offset = (page) * limit;
        const id = jwtUserDto.id;

        const followedByMe = await Follower.findAndCountAll({
            distinct: true,
            include: [{
                model: User,
                as: 'followingUser',
                required: false,
                // attributes: ['id'],
                include: [
                    {
                        model: Follower,
                        as: 'followers',
                        where: {
                            isActive: 1,
                            'followerId': {
                                [Op.eq]: jwtUserDto.id
                            },
                        },
                        required: false,
                    }]

            },
            {
                model: User,
                as: 'followerUser',
                required: false,
                // attributes: ['id', 'slug'],
                where: {
                    slug: 'louis-bland'
                }
            }
            ],
            where: {
                isActive: 1,
                followerId: { [Op.col]: 'followerUser.id' },
                followingId: {
                    [Op.not]: { [Op.col]: 'followerUser.id' },
                }
            }
        });

        let followingIds = await followedByMe.rows.map((followersData) => followersData.followingId)

        return await this.userModel.findAndCountAll({
            include: [
                {
                    model: Follower,
                    as: 'followers',
                    where: {
                        isActive: 1,
                        'followerId': {
                            [Op.eq]: id
                        },
                    },
                    required: false,
                }
            ],
            where: {
                stateId: user.stateId,
                role: 2,
                [Op.and]: [{ id: { [Op.ne]: user.id } }, { id: { [Op.notIn]: followingIds } }],


            },
            limit,
            offset,
            order: [['createdAt', 'DESC']],
        })
    }
}
