package com.vijay.platform.authorization.service;

import com.vijay.platform.authorization.dto.CreateRoleRequest;
import com.vijay.platform.authorization.dto.RoleResponse;
import com.vijay.platform.authorization.dto.UpdateRoleRequest;
import com.vijay.platform.authorization.entity.Role;
import com.vijay.platform.authorization.exception.RoleAlreadyExistsException;
import com.vijay.platform.authorization.exception.RoleNotFoundException;
import com.vijay.platform.authorization.repository.RoleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class RoleService {
    private final RoleRepository roleRepository;

    @Transactional(readOnly = true)
    public List<RoleResponse> getAllRoles(){
          return roleRepository.findAll().stream().map(this::toResponse).toList();
    }
    @Transactional(readOnly = true)
    public RoleResponse getRoleById(Long id){
        return toResponse(roleRepository.findById(id).orElseThrow(()->new RoleNotFoundException(id)));
    }

    public RoleResponse createRole(CreateRoleRequest request){
        if(roleRepository.existsByName(request.getName())){
            throw  new RoleAlreadyExistsException(request.getName());
        }
        Role role=new Role();
        role.setName(request.getName());
        Role savaedRole=roleRepository.save(role);
        return  toResponse(savaedRole);
    }

    public RoleResponse updateRole(Long id, UpdateRoleRequest request){
        Role role=roleRepository.findById(id).orElseThrow(()->new RoleNotFoundException(id));

        if(!role.getName().equals(request.getName()) && roleRepository.existsByName(request.getName())){
           throw new RoleAlreadyExistsException(request.getName());
        }

        role.setName(request.getName());
        Role savedRole=roleRepository.save(role);
        return toResponse(savedRole);
    }


    public void deleteRole(Long id) {

        Role role = roleRepository.findById(id)
                .orElseThrow(() -> new RoleNotFoundException(id));

        roleRepository.delete(role);
    }

    public RoleResponse toResponse(Role role){
        return RoleResponse.builder().name(role.getName()).id(role.getId()).permissions(
                role.getPermissions().stream().map(permission -> permission.getName()).collect(Collectors.toSet())).build();
    }
}
